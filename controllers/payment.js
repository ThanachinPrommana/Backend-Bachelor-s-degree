// controllers/payment.js (ESM, revised)

import prisma from "../config/prisma.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/payment/intent
 * body: { postId: string, unitId: string }
 */
export const createStripePaymentIntent = async (req, res) => {
  try {
    const user = req.session?.user; // หรือ req.user ถ้าใช้ auth middleware แบบ bearer
    const buyerId = user?.userId;

    if (!buyerId) {
      return res.status(401).json({ message: "Unauthorized: กรุณาเข้าสู่ระบบ" });
    }

    const { postId, unitId } = req.body || {};
    if (!postId || !unitId) {
      return res
        .status(400)
        .json({ message: "Bad Request: postId และ unitId จำเป็นต้องมี" });
    }

    // 1) ตรวจสอบเอกสารที่อนุมัติแล้วของ buyer สำหรับโพสต์และยูนิตนี้
    const document = await prisma.documentUpload.findFirst({
      where: {
        userId: buyerId,
        postId,
        unitId,
        Review_Status: "APPROVED",
      },
      select: { id: true },
    });

    if (!document) {
      return res.status(403).json({
        message:
          "Forbidden: เอกสารสำหรับประกาศ/ยูนิตนี้ยังไม่ได้รับการอนุมัติ หรือไม่พบเอกสาร",
      });
    }

    // 2) ดึงข้อมูลมัดจำ
    const deposit = await prisma.deposit.findFirst({
      where: { postId },
      include: { Post: { select: { userId: true } } },
    });

    if (!deposit) {
      return res
        .status(404)
        .json({ message: "Not Found: ไม่พบข้อมูลมัดจำสำหรับประกาศนี้" });
    }

    // ต้องอยู่สถานะรอจ่าย
    if (deposit.Deposit_Status !== "PENDING") {
      return res
        .status(409)
        .json({ message: "Deposit ไม่อยู่ในสถานะ PENDING" });
    }

    // 3) ตรวจสอบสถานะของยูนิต
    const unit = await prisma.propertyUnit.findUnique({
      where: { id: unitId },
      select: { id: true, Status: true },
    });

    // ยูนิตควรเป็น PENDING ตั้งแต่ตอนยื่นเอกสาร (กันชนกัน)
    if (!unit || unit.Status !== "PENDING") {
      return res.status(409).json({
        message: `Conflict: ยูนิตนี้ไม่ว่างสำหรับการมัดจำ (สถานะปัจจุบัน: ${unit?.Status ?? "UNKNOWN"})`,
      });
    }

    // 4) คำนวณจำนวนเงิน (สตางค์)
    const amountInSatang = Math.max(
      0,
      Math.round(Number(deposit.Deposit_Amount) * 100)
    );
    if (!amountInSatang) {
      return res
        .status(422)
        .json({ message: "Invalid deposit amount on this post" });
    }

    // 5) สร้าง PaymentIntent (เพิ่ม idempotency key กันคลิ้กซ้ำ)
    const idempotencyKey = `dep_${deposit.id}_unit_${unitId}_buyer_${buyerId}`;

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInSatang,
        currency: "thb",
        automatic_payment_methods: { enabled: true },
        metadata: {
          depositId: deposit.id,
          postId: deposit.postId,
          buyerId,
          unitId,
        },
      },
      { idempotencyKey }
    );

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating Stripe Payment Intent:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
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
