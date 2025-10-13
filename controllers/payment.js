// controllers/payment.js (ESM, revised)

import prisma from "../config/prisma.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/payment/intent
 * body: { postId: string, unitId: string }
 */
export const createStripePaymentIntent = async (req, res) => {
  console.log("--- [START] createStripePaymentIntent ---");
  try {
    // 1. ดึงข้อมูลที่จำเป็นทั้งหมดออกมาที่จุดเดียว
    const { postId, unitId } = req.body || {};
    const buyerId = req.session?.user?.userId;

    // 2. ตรวจสอบข้อมูลทันที
    if (!buyerId) {
      console.error("[ERROR] Unauthorized: User not found in session.");
      return res.status(401).json({ message: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }
    if (!postId || !unitId) {
      console.error("[ERROR] Bad Request: Missing postId or unitId in the request body.");
      return res.status(400).json({ message: "Bad Request: postId และ unitId จำเป็นต้องมี" });
    }
    console.log(`[INFO] Processing for buyerId: ${buyerId}, postId: ${postId}`);

    // 3. ตรวจสอบเอกสาร (Document)
    const document = await prisma.documentUpload.findFirst({
      where: { userId: buyerId, postId, unitId, Review_Status: "APPROVED" },
    });

    if (!document) {
      console.error(`[ERROR] Forbidden: No approved document for buyerId: ${buyerId} and postId: ${postId}`);
      return res.status(403).json({
        message: "Forbidden: เอกสารสำหรับประกาศ/ยูนิตนี้ยังไม่ได้รับการอนุมัติ หรือไม่พบเอกสาร",
      });
    }

    // 4. ดึงข้อมูลมัดจำ (Deposit)
    const deposit = await prisma.deposit.findFirst({
      where: { propertyUnitId: unitId },
    });

    if (!deposit) {
      console.error(`[ERROR] Not Found: Deposit information not found for postId: ${postId}`);
      return res.status(404).json({ message: "Not Found: ไม่พบข้อมูลมัดจำสำหรับประกาศนี้" });
    }
    if (deposit.Deposit_Status !== "PENDING") {
      console.error(`[ERROR] Conflict: Deposit status for postId ${postId} is '${deposit.Deposit_Status}', not 'PENDING'.`);
      return res.status(409).json({ message: "Deposit ไม่อยู่ในสถานะ PENDING" });
    }

    // (ส่วนยูนิตยังไม่จำเป็นต้องเช็คซ้ำ เพราะเช็คตั้งแต่ตอนอนุมัติเอกสารแล้ว)

    // 5. สร้าง Stripe Payment Intent
    const amountInSatang = Math.round(Number(deposit.Deposit_Amount) * 100);
    if (!amountInSatang || amountInSatang <= 0) {
      console.error(`[ERROR] Invalid Amount: Calculated amount is ${amountInSatang} for postId: ${postId}`);
      return res.status(422).json({ message: "Invalid deposit amount." });
    }

    // const idempotencyKey = `dep_${deposit.id}_unit_${unitId}_buyer_${buyerId}`;
    // เพิ่ม Date.now() เพื่อสร้าง key ใหม่ทุกครั้งที่ทดสอบ
    const idempotencyKey = `dep_${deposit.id}_unit_${unitId}_buyer_${buyerId}_${Date.now()}`;
    console.log(`[INFO] Creating Stripe Payment Intent with amount: ${amountInSatang} satang`);

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInSatang,
        currency: "thb",
        automatic_payment_methods: { enabled: true },
        metadata: {
          depositId: deposit.id,
          postId: postId, // ใช้ postId จาก req.body ที่ตรวจสอบแล้ว
          buyerId: buyerId,
          unitId: unitId,
        },
      },
      { idempotencyKey }
    );

    console.log("[SUCCESS] Stripe Payment Intent created successfully.");
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error("[CRITICAL ERROR] An unexpected error occurred:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * POST /api/stripe/webhook
 * - ใน server.js ต้องตั้งค่า:
 *   app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook)
 * - ห้ามมี express.json() มาก่อน route นี้
 */
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    // req.body ต้องเป็น raw Buffer (เพราะใช้ express.raw)
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`❌ Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      // อ่าน metadata
      const { depositId, postId, buyerId, unitId } = paymentIntent.metadata || {};

      // เพิ่มบรรทัดนี้เข้าไปเพื่อ Debug
      console.log("🔴 DEBUG: Metadata received in webhook:", {
        depositId,
        postId,
        buyerId,
        unitId,
        paymentIntentId: paymentIntent.id,
      });
      // ตรวจสอบ metadata
      if (!depositId || !postId || !buyerId || !unitId) {
        console.error(
          "❌ Webhook Error: Missing metadata in payment intent",
          paymentIntent.id
        );
        return res
          .status(400)
          .send("Webhook Error: Missing required metadata.");
      }

      // Idempotency check + ธุรกรรม DB
      const existingDeposit = await prisma.deposit.findUnique({
        where: { id: depositId },
        select: { id: true, Deposit_Status: true },
      });

      if (!existingDeposit || existingDeposit.Deposit_Status !== "PENDING") {
        // เคยอัปเดตไปแล้ว หรือสถานะไม่ถูกต้อง — ตอบ 200 เพื่อไม่ให้ Stripe ส่งซ้ำ
        console.log(
          `☑️ Webhook for depositId: ${depositId} already processed or invalid.`
        );
        return res
          .status(200)
          .json({ received: true, message: "Event already processed." });
      }

      await prisma.$transaction(async (tx) => {
        // 1) อัปเดต Deposit -> CONFIRMED + ผูก userId ของผู้จ่าย
        await tx.deposit.update({
          where: { id: depositId },
          data: {
            Deposit_Status: "CONFIRMED",
            userId: buyerId,
          },
        });

        // 2) สร้าง Payment record
        await tx.payment.create({
          data: {
            userId: buyerId,
            postId: postId,
            PaymentType: "STRIPE", // enum ของคุณรองรับ STRIPE แล้ว
            Payment_Amount: paymentIntent.amount / 100, // กลับมาเป็นบาท
            Payment_Slip: paymentIntent.id, // เก็บ PaymentIntent ID เป็นหลักฐาน
            Status: "CONFIRMED",
          },
        });
        
        await tx.documentUpload.updateMany({
          where: {
            userId: buyerId,
            postId: postId,
            unitId: unitId,
            Review_Status: "APPROVED",
          },
          data: {
            Review_Status: "HIDDEN", // <-- เปลี่ยนจาก PAID เป็น HIDDEN
          },
        });

        // 3) (ออปชัน) อัปเดตสถานะยูนิตถ้าต้องการ
        // ณ ตอนนี้คุณออกแบบให้ยูนิตขึ้นเป็น PENDING ตั้งแต่ตอนอนุมัติเอกสารแล้ว
        // ถ้าต้องการกันซ้ำมากขึ้น อาจอัปเดตเป็น SOLD/RENTED ภายหลังในขั้นตอนสุดท้าย
        // await tx.propertyUnit.update({
        //   where: { id: unitId },
        //   data: { Status: "PENDING" }, // หรือสถานะอื่นตาม flow ของคุณ
        // });
      });

      console.log(`✅ Database updated successfully for depositId: ${depositId}`);
    } else {
      console.log(`💡 Unhandled event type ${event.type}`);
    }

    // ตอบกลับ 200 เพื่อยืนยันการรับ Event
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Error handling webhook:", err);
    // ถ้าเป็น error ของฝั่งเรา ให้ตอบ 500 เพื่อให้ Stripe retry
    return res.status(500).json({ error: "Database update failed." });
  }
};
