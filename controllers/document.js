// controllers/document.js
const prisma = require("../config/prisma");
const cloudinary = require("../utils/cloudinary");

// ---------- Helpers ----------
const getSessionUserId = (req) => {
  const u = req.session?.user;
  return u?.userId ?? u?.id ?? null; // รองรับทั้ง userId และ id
};

const getSessionUserType = (req) => {
  const t = req.session?.user?.userType ?? req.session?.user?.role ?? "";
  return String(t).toUpperCase(); // เทียบแบบตัวใหญ่
};

// แปลง documentId ให้เข้ากับชนิดใน Prisma (ถ้าเป็น Int)
const coerceId = (raw) => {
  if (raw == null) return raw;
  // ถ้าเป็น string ตัวเลขล้วน → Number, อย่างอื่นคงเดิม (เช่น uuid)
  return /^\d+$/.test(String(raw)) ? Number(raw) : raw;
};

// ========== อนุมัติ/ปฏิเสธเอกสาร ==========
exports.approveDocument = async (req, res) => {
  try {
    const sessionUserId = getSessionUserId(req);
    if (!sessionUserId) {
      return res.status(401).json({ message: "Unauthorized, please login first" });
    }

    const userType = getSessionUserType(req);
    if (userType !== "SELLER") {
      return res.status(403).json({
        message: "Forbidden: Only sellers can approve documents.",
      });
    }

    const { documentId: rawId } = req.params;
    const documentId = coerceId(rawId);

    const { status } = req.body || {};
    if (!["APPROVED", "REJECTED"].includes(String(status))) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const documentToUpdate = await prisma.documentUpload.findUnique({
      where: { id: documentId },
      include: {
        Post: { select: { userId: true } }, // เจ้าของโพสต์ (Seller)
      },
    });

    if (!documentToUpdate) {
      return res.status(404).json({ message: "Document not found" });
    }

    // อนุญาตเฉพาะเจ้าของโพสต์เท่านั้น
    if (documentToUpdate?.Post?.userId !== sessionUserId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You are not the owner of this post." });
    }

    if (status === "APPROVED") {
      const updatedDocument = await prisma.documentUpload.update({
        where: { id: documentId },
        data: { Review_Status: "APPROVED" },
      });

      await prisma.notification.create({
        data: {
          userId: updatedDocument.userId, // ผู้ส่งเอกสาร (Buyer)
          Title: "เอกสารของคุณได้รับการอนุมัติแล้ว",
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

    // === REJECTED ===
    const buyerId = documentToUpdate.userId; // เจ้าของเอกสาร (ผู้ส่ง)
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
        userId: buyerId, // << แก้จาก uploaderUserId → buyerId
        Title: "เอกสารของคุณถูกปฏิเสธ",
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

// ========== ดึงเอกสารของฉัน ==========
exports.getDocument = async (req, res) => {
  try {
    const sessionUserId = getSessionUserId(req);
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

// ========== ตัวช่วยค้นหา ==========
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

    const qUpper = String(query).toUpperCase();
    if (validStatuses.includes(qUpper)) {
      whereClause.OR.push({
        Review_Status: { equals: qUpper },
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

// ========== ค้นหาเอกสาร ==========
exports.searchDocument = async (req, res) => {
  try {
    const sessionUserId = getSessionUserId(req);
    if (!sessionUserId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { q } = req.body || {};
    if (q) {
      // ส่งต่อไป helper และ return เพื่อกันส่ง response ซ้ำ
      return handlequeryDoc(req, res, q);
    }
    return res.json([]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};
