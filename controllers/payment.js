// console.log("My Stripe Secret Key is:", process.env.STRIPE_SECRET_KEY);
import prisma from "../config/prisma.js";
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripePaymentIntent = async (req, res) => {
    try {
        const user = req.session.user; // หรือ req.user จาก authMiddleware
        const buyerId = user.userId;
        const { postId, unitId } = req.body;

        if (!postId || !unitId) {
            return res.status(400).json({ message: "Bad Request: ไม่พบ postId" });
        }

        const document = await prisma.documentUpload.findFirst({
            where: {
                userId: buyerId,
                postId: postId,
                unitId: unitId
            }
        })

        // console.log("ID:", document)

        if (!document || document.Review_Status !== "APPROVED") {
            return res.status(403).json({
                message: "Forbidden: เอกสารสำหรับประกาศนี้ยังไม่ได้รับการอนุมัติ หรือไม่พบเอกสาร"
            })
        }

        const deposit = await prisma.deposit.findFirst({
            where: { postId: postId },
            include: { Post: { select: { userId: true } } }
        });

        if (!deposit) {
            return res.status(404).json({ message: "Not Found: ไม่พบข้อมูลมัดจำสำหรับประกาศนี้" });
        }

        // if (deposit.Post.userId === buyerId) {
        //     return res.status(403).json({ message: "Forbidden: คุณไม่สามารถมัดจำประกาศของตัวเองได้" });
        // }s
        // ตรวจสอบสถานะของยูนิตโดยตรง (สำคัญมาก)
        const unit = await prisma.propertyUnit.findUnique({
            where: { id: unitId }
        });

        if (!unit || unit.Status !== 'PENDING') { // สถานะของยูนิตควรเป็น PENDING จากขั้นตอนการอัปโหลดเอกสาร
            return res.status(409).json({ message: `Conflict: ยูนิตนี้ไม่ว่างสำหรับการมัดจำ (สถานะปัจจุบัน: ${unit?.Status})` });
        }

        const amountInSatang = Math.round(deposit.Deposit_Amount * 100);

        // ⭐️ปรับปรุง: ใช้ automatic_payment_methods เพื่อความยืดหยุ่น
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInSatang,
            currency: 'thb',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                depositId: deposit.id,
                postId: deposit.postId,
                buyerId: buyerId,
                unitId: unitId
            }
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error("Error creating Stripe Payment Intent:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const handleStripeWebhook = async (req, res) => {

    // console.log('1. ได้รับ Webhook แล้ว');

    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

        // console.log('2. ตรวจสอบลายเซ็นสำเร็จ');
    } catch (err) {
        console.log(`❌ Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        // console.log('3. Event คือ payment_intent.succeeded');

        const paymentIntent = event.data.object;
        const { depositId, postId, buyerId } = paymentIntent.metadata;

        // ตรวจสอบว่ามี metadata ที่จำเป็นครบถ้วนหรือไม่
        if (!depositId || !postId || !buyerId) {
            console.error('❌ Webhook Error: Missing metadata in payment intent', paymentIntent.id);
            return res.status(400).send('Webhook Error: Missing required metadata.');
        }

        try {
            // ⭐️ปรับปรุง: เพิ่ม Idempotency Check
            // ตรวจสอบสถานะของ deposit ก่อนเริ่ม transaction
            // console.log('4. กำลังจะเริ่มตรวจสอบฐานข้อมูล...');
            const existingDeposit = await prisma.deposit.findUnique({
                where: { id: depositId },
            });
            // console.log('5. ค้นหา deposit ที่มีอยู่:', existingDeposit); // ⭐️ เพิ่มบรรทัดนี้

            // ถ้าไม่เจอ deposit หรือสถานะไม่ใช่ AVAILABLE ให้หยุดทำงาน
            if (!existingDeposit || existingDeposit.Deposit_Status !== 'PENDING') {
                console.log(`☑️ Webhook for depositId: ${depositId} already processed or invalid.`);
                // ตอบกลับ 200 เพื่อบอก Stripe ว่ารับ Event แล้ว ไม่ต้องส่งซ้ำ
                return res.status(200).json({ received: true, message: 'Event already processed.' });
            }

            // ถ้า deposit ยัง AVAILABLE อยู่ ก็เริ่มทำ Transaction
            await prisma.$transaction(async (tx) => {
                // อัปเดตตาราง Deposit
                // console.log('6. เริ่ม Transaction...');
                await tx.deposit.update({
                    where: { id: depositId },
                    data: {
                        Deposit_Status: 'CONFIRMED',
                        userId: buyerId
                    }
                });

                // สร้าง record ในตาราง Payment
                await tx.payment.create({
                    data: {
                        userId: buyerId,
                        postId: postId,
                        PaymentType: 'STRIPE',
                        Payment_Amount: paymentIntent.amount / 100,
                        Payment_Slip: paymentIntent.id, // เก็บ Stripe Payment Intent ID ไว้เป็นหลักฐาน
                        Status: 'CONFIRMED',
                    },
                });
                // console.log('7. Transaction เสร็จสิ้น');
            });

            console.log(`✅ Database updated successfully for depositId: ${depositId}`);

        } catch (err) {
            console.error(`❌ Error updating database for depositId ${depositId}:`, err);
            // ในกรณีที่เกิดข้อผิดพลาดจากฝั่งเรา ควรตอบ 500 เพื่อให้ Stripe ลองส่ง Webhook มาใหม่
            return res.status(500).json({ error: 'Database update failed.' });
        }
    } else {
        console.log(`💡 Unhandled event type ${event.type}`);
    }

    // ตอบกลับ 200 เพื่อยืนยันการรับ Event
    res.status(200).json({ received: true });
};