// controllers/document.js

// const prisma = require("@prisma/client")
const prisma = require("../config/prisma")
const cloudinary = require("../utils/cloudinary")
//complete
exports.approveDocument = async (req, res) => {
    try {


        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized, please login first" });
        }

        const { userId: approverId, userType } = req.session.user;

        if (userType !== 'Seller') {
            return res.status(403).json({
                message: "Forbidden: Only sellers can approve documents."
            });
        }

        const { documentId } = req.params

        const { status } = req.body

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

    const documentToUpdate = await prisma.documentUpload.findUnique({
      where: { id: documentId },
      include: {
        Post: { select: { userId: true } }, // เจ้าของโพสต์
      },
    });

        if (!documentToUpdate) {
            return res.status(404).json({ message: "Document not found" });
        }
        if (documentToUpdate.Post.userId !== approverId) {
            return res.status(403).json({ message: "Forbidden: You are not the owner of this post." });
        }

        if (status === "APPROVED") {
            const updatedDocument = await prisma.documentUpload.update({
                where: { id: documentId },
                data: { Review_Status: 'APPROVED' },
            });
            await prisma.notification.create({
                data: {
                    userId: updatedDocument.userId, // ID ของ Buyer ผู้อัปโหลด
                    Title: `เอกสารของคุณได้รับการอนุมัติแล้ว`,
                    Message: `เอกสาร "${updatedDocument.DocumentName}" สำหรับโพสต์ของคุณได้รับการอนุมัติ`,
                    Status: "UNREAD",
                    relatedProcess: "DOCUMENT_APPROVAL",
                    referenceId: updatedDocument.id
                },
            });
            res.json({
                message: "Document APPROVED successfully",
                document: updatedDocument,
            });
        }else{
            const buyerId = documentToUpdate.userId;
            const docName = documentToUpdate.DocumentName;
            const cloudinaryPublicId = documentToUpdate.CloudinaryPublicId;
            console.log("ID cloud:",cloudinaryPublicId)
            // !! ข้อแนะนำสำคัญ: ลบไฟล์ออกจาก Cloudinary (หรือ Storage อื่นๆ) ด้วย !!
            if (cloudinaryPublicId) {
                await cloudinary.uploader.destroy(cloudinaryPublicId);
            }

    await prisma.documentUpload.delete({ where: { id: documentId } });

            // สร้าง Notification แจ้งเตือน Buyer
            await prisma.notification.create({
                data: {
                    userId: uploaderUserId, // ใช้ ID ของ Buyer ที่เก็บไว้
                    Title: `เอกสารของคุณถูกปฏิเสธ`,
                    Message: `เอกสาร "${docName}" ที่คุณส่งมาถูกปฏิเสธและลบออกจากระบบแล้ว`,
                    Status: "UNREAD",
                    relatedProcess: "DOCUMENT_REJECTION",
                    // ไม่มี referenceId เพราะเอกสารถูกลบไปแล้ว
                },
            });

    return res.json({
      message: "Document REJECTED and deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};

// ===== Get my documents =====
exports.getDocument = async (req, res) => {
  try {
    const sessionUserId = req.session?.user?.id;
    if (!sessionUserId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const docs = await prisma.documentUpload.findMany({
      where: { userId: sessionUserId },
      select: {
        id: true,
        DocumentName: true,
        Review_Status: true,
        DocumentUrl: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(docs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ===== Search helper =====
const handlequeryDoc = async (req, res, query) => {
  try {
    const validStatuses = ["PENDING", "APPROVED", "REJECTED"];

    const whereClause = {
      OR: [
        {
          DocumentName: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    };

    if (validStatuses.includes(String(query).toUpperCase())) {
      whereClause.OR.push({
        Review_Status: { equals: String(query).toUpperCase() },
      });
    }

    const doc = await prisma.documentUpload.findMany({
      where: whereClause,
      select: {
        id: true,
        DocumentName: true,
        Review_Status: true,
        DocumentUrl: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ===== Search documents =====
exports.searchDocument = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.userId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
        const { q } = req.body
        console.log("q:", q)
        if (q) {
            await handlequeryDoc(req, res, q);
        } else {
            return res.json([]);
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}
