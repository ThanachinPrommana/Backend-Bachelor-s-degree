const prisma = require("../config/prisma")

exports.createDepositPayment = async (req, res) => {
    try {
        // 1. ตรวจสอบการเข้าสู่ระบบและดึงข้อมูลผู้ใช้ (ผู้ซื้อ)
        const user = req.session.user;
        if (!user || !user.userId) {
            return res.status(401).json({ message: "Unauthorized: โปรดเข้าสู่ระบบ" });
        }
        const buyerId = user.userId;

        // 2. รับข้อมูลจาก request body
        const { postId, amount, paymentSlipUrl } = req.body;

        // ตรวจสอบข้อมูลเบื้องต้น
        if (!postId || !amount || !paymentSlipUrl) {
            return res.status(400).json({ message: "Bad Request: ข้อมูลไม่ครบถ้วน" });
        }

        const result = await prisma.$transaction(async (tx) => {
            // 3. ค้นหา Deposit ของโพสต์นี้ และข้อมูลเจ้าของโพสต์
            const deposit = await tx.deposit.findFirst({
                where: { postId: postId },
                include: {
                    Post: {
                        select: { userId: true } // userId ของผู้ขาย (Seller)
                    }
                }
            });

            if (!deposit) {
                throw new Error("Not Found: ไม่พบข้อมูลมัดจำสำหรับประกาศนี้");
            }

            // 4. ตรวจสอบเงื่อนไขต่างๆ ก่อนทำรายการ
            if (deposit.Post.userId === buyerId) {
                throw new Error("Forbidden: คุณไม่สามารถมัดจำประกาศของตัวเองได้");
            }
            if (deposit.Deposit_Status !== 'AVAILABLE') {
                throw new Error("Conflict: ประกาศนี้ถูกมัดจำไปแล้วหรือไม่ได้อยู่ในสถานะว่าง");
            }
            if (parseFloat(amount) !== deposit.Deposit_Amount) {
                throw new Error("Bad Request: จำนวนเงินที่ชำระไม่ตรงกับยอดมัดจำที่กำหนด");
            }

            // 5. สร้างบันทึกการชำระเงิน (Payment)
            const newPayment = await tx.payment.create({
                data: {
                    userId: buyerId,
                    postId: postId,
                    PaymentType: 'DEPOSIT', // ระบุประเภทการจ่ายเงิน
                    Payment_Amount: parseFloat(amount),
                    Payment_Slip: paymentSlipUrl,
                    Status: 'PENDING_VERIFICATION' // สถานะของ "ใบเสร็จ" นี้
                }
            });

            // 6. อัปเดตสถานะของ Deposit หลัก
            const updatedDeposit = await tx.deposit.update({
                where: { id: deposit.id },
                data: {
                    userId: buyerId, // ผูกผู้ซื้อเข้ากับ Deposit
                    Deposit_Status: 'PENDING_REVIEW' // เปลี่ยนสถานะเป็น "รอการตรวจสอบ"
                }
            });

            return { newPayment, updatedDeposit };
        });

        res.status(201).json({
            message: "Deposit payment submitted successfully. Awaiting verification.",
            data: result
        });

    } catch (error) {
        console.error("Error creating deposit payment:", error.message);

        // จัดการ Error Code ตามข้อความที่โยนมาจาก Transaction
        if (error.message.includes("Forbidden")) return res.status(403).json({ message: error.message });
        if (error.message.includes("Not Found")) return res.status(404).json({ message: error.message });
        if (error.message.includes("Conflict")) return res.status(409).json({ message: error.message });
        if (error.message.includes("Bad Request")) return res.status(400).json({ message: error.message });
        
        res.status(500).json({ message: "Server Error" });
    }
};
