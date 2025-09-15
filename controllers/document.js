// controllers/document.js

// const prisma = require("@prisma/client")
// ❌ ลบ: const { include } = require("params")
const prisma = require("../config/prisma");
const cloudinary = require("../utils/cloudinary");

// Helpers
const coerceId = (raw) => {
  // ถ้า id ใน Prisma เป็น Int ให้แปลงเป็น Number, ถ้าเป็น string/uuid ก็จะคงเดิม
  if (raw === undefined || raw === null) return raw;
  const n = Number(raw);
  return Number.isNaN(n) ? raw : n;
};

// ===== Approve/Reject document =====
exports.approveDocument = async (req, res) => {
  try {
    const sessionUserId = req.session?.user?.id;
    if (!sessionUserId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please log in." });
    }

    const { documentId: rawId } = req.params;
    const documentId = coerceId(rawId);

    const { status } = req.body || {};
    if (!["APPROVED", "REJECTED"].includes(status)) {
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

    // อนุญาตเฉพาะเจ้าของโพสต์
    if (documentToUpdate.Post?.userId !== sessionUserId) {
      return res.status(403).json({
        message: "Forbidden: You are not the owner of this post.",
      });
    }

    if (status === "APPROVED") {
      const updatedDocument = await prisma.documentUpload.update({
        where: { id: documentId },
        data: { Review_Status: "APPROVED" },
      });

      await prisma.notification.create({
        data: {
          userId: updatedDocument.userId, // ผู้ส่งเอกสาร (Buyer)
          Title: `เอกสารของคุณได้รับการอนุมัติแล้ว`,
          Message: `เอกสาร "${updatedDocument.DocumentName}" สำหรับโพสต์ของคุณได้รับการอนุมัติ`,
          Status: "UNREAD",
          relatedProcess: "DOCUMENT_APPROVAL",
          referenceId: updatedDocument.id,
        },
      });

      return res.json({
        message: "Document APPROVED successfully",
        document: updatedDocument,
      });
    }

    // REJECTED → ลบไฟล์ + ลบเรคอร์ด + แจ้งเตือน
    const buyerId = documentToUpdate.userId;
    const docName = documentToUpdate.DocumentName;
    const cloudinaryPublicId = documentToUpdate.CloudinaryPublicId;

    if (cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(cloudinaryPublicId);
      } catch (e) {
        console.warn("Cloudinary destroy failed:", e.message);
      }
    }

    await prisma.documentUpload.delete({ where: { id: documentId } });

    await prisma.notification.create({
      data: {
        userId: buyerId,
        Title: `เอกสารของคุณถูกปฏิเสธ`,
        Message: `เอกสาร "${docName}" ที่คุณส่งมาถูกปฏิเสธและลบออกจากระบบแล้ว`,
        Status: "UNREAD",
        relatedProcess: "DOCUMENT_REJECTION",
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
    const sessionUserId = req.session?.user?.id;
    if (!sessionUserId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { q } = req.body || {};
    if (q) {
      return handlequeryDoc(req, res, q);
    }
    return res.json([]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};
