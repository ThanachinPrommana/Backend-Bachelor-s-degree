const prisma = require("../config/prisma")

exports.createStripePaymentIntent = async (req, res) => {

    try {

        const user = req.session.user; // หรือ req.user จาก authMiddleware

        const buyerId = user.userId;



        const { postId } = req.body;

        if (!postId) {

            return res.status(400).json({ message: "Bad Request: ไม่พบ postId" });

        }



        const deposit = await prisma.deposit.findFirst({

            where: { postId: postId },

            include: { Post: { select: { userId: true } } }

        });



        if (!deposit) {

            return res.status(404).json({ message: "Not Found: ไม่พบข้อมูลมัดจำสำหรับประกาศนี้" });

        }

        if (deposit.Post.userId === buyerId) {

            return res.status(403).json({ message: "Forbidden: คุณไม่สามารถมัดจำประกาศของตัวเองได้" });

        }

        if (deposit.Deposit_Status !== 'AVAILABLE') {

            return res.status(409).json({ message: "Conflict: ประกาศนี้ไม่ว่างสำหรับการมัดจำ" });

        }



        const amountInSatang = Math.round(deposit.Deposit_Amount * 100);



        const paymentIntent = await stripe.paymentIntents.create({

            amount: amountInSatang,

            currency: 'thb',

            payment_method_types: ['card', 'promptpay'],

            metadata: {

                depositId: deposit.id,

                postId: deposit.postId,

                buyerId: buyerId

            }

        });



        res.status(200).json({

            clientSecret: paymentIntent.client_secret,

        });



    } catch (error) {

        console.error("Error creating Stripe Payment Intent:", error.message);

        res.status(500).json({ message: "Server Error" });

    }

};



/**

* 2. รับและจัดการ Webhook จาก Stripe

* ถูกเรียกใช้โดย Server ของ Stripe เท่านั้น

*/

exports.handleStripeWebhook = async (req, res) => {

    const sig = req.headers['stripe-signature'];

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;



    try {

        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    } catch (err) {

        console.log(`❌ Webhook signature verification failed.`, err.message);

        return res.status(400).send(`Webhook Error: ${err.message}`);

    }



    if (event.type === 'payment_intent.succeeded') {

        const paymentIntent = event.data.object;

        console.log('✅ PaymentIntent was successful!', paymentIntent.id);



        const { depositId, postId, buyerId } = paymentIntent.metadata;



        try {

            await prisma.$transaction(async (tx) => {

                const updatedDeposit = await tx.deposit.update({

                    where: { id: depositId },

                    data: {

                        Deposit_Status: 'CONFIRMED',

                        userId: buyerId // ⭐️ อัปเดต userId ที่นี่!

                    }

                });



                await tx.payment.create({

                    data: {

                        userId: buyerId,

                        postId: postId,

                        PaymentType: 'STRIPE',

                        Payment_Amount: paymentIntent.amount / 100,

                        Payment_Slip: paymentIntent.id,

                        Status: 'COMPLETED',

                    },

                });

            });

            console.log('✅ Database updated for depositId:', depositId);

        } catch (err) {

            console.error('❌ Error updating database from webhook:', err);

            return res.status(500).json({ error: 'Database update failed.' });

        }

    } else {

        console.log(`Unhandled event type ${event.type}`);

    }



    res.status(200).json({ received: true });

};
