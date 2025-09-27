// controllers/document.js (merged & reconciled, ESM)

import prisma from "../config/prisma.js";
import cloudinary from "../utils/cloudinary.js";

// ---------- Helpers ----------
const getSessionUserId = (req) => {
  const u = req.session?.user;
  return u?.userId ?? u?.id ?? null; // รองรับทั้ง userId และ id
};

const getSessionUserType = (req) => {
  const t = req.session?.user?.userType ?? req.session?.user?.role ?? "";
  return String(t).toUpperCase(); // เทียบแบบตัวใหญ่ (SELLER/BUYER/ADMIN)
};

// แปลง documentId ให้เข้ากับชนิดใน Prisma (ถ้า schema ใช้ Int)
const coerceId = (raw) => {
  if (raw == null) return raw;
  // ถ้าเป็น string ตัวเลขล้วน → Number, อย่างอื่นคงเดิม (เช่น uuid)
  return /^\d+$/.test(String(raw)) ? Number(raw) : raw;
};

// ========== อนุมัติ/ปฏิเสธเอกสาร ==========
export const approveDocument = async (req, res) => {
  try {
    const sessionUserId = getSessionUserId(req);
    if (!sessionUserId) {
      return res
        .status(401)
        .json({ message: "Unauthorized, please login first" });
    }

    const userType = getSessionUserType(req);
    // เดิม: อนุญาตเฉพาะ SELLER; เพิ่ม ADMIN ให้ทำได้ด้วย (ถ้าไม่ต้องการ ลบบรรทัด ADMIN ออก)
    if (!["SELLER", "ADMIN"].includes(userType)) {
      return res.status(403).json({
        message: "Forbidden: Only sellers/admins can approve documents.",
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

    // อนุญาตเฉพาะ "เจ้าของโพสต์" หรือ "ADMIN" เท่านั้น
    const postOwnerId = documentToUpdate?.Post?.userId ?? null;
    if (userType !== "ADMIN") {
      if (!postOwnerId || postOwnerId !== sessionUserId) {
        return res
          .status(403)
          .json({ message: "Forbidden: You are not the owner of this post." });
      }
    }

    if (status === "APPROVED") {
      const updatedDocument = await prisma.documentUpload.update({
        where: { id: documentId },
        data: { Review_Status: "APPROVED" },
      });

      // แจ้งเตือนผู้ส่งเอกสาร (Buyer)
      await prisma.notification.create({
        data: {
          userId: updatedDocument.userId,
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
        // ไม่ให้ล้มเพราะลบไฟล์ไม่สำเร็จ — log ไว้พอ
        console.warn("Cloudinary destroy failed:", e.message);
      }
    }

    await prisma.documentUpload.delete({ where: { id: documentId } });

    // แจ้งเตือนผู้ส่งเอกสาร (ถูกปฏิเสธ)
    await prisma.notification.create({
      data: {
        userId: buyerId,
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
    console.error("approveDocument error:", err);
    return res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};

// ========== ดึงเอกสารของฉัน ==========
export const getDocument = async (req, res) => {
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
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(docs);
  } catch (err) {
    console.error("getDocument error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ========== ตัวช่วยค้นหา ==========
const handleQueryDoc = async (req, res, query) => {
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
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ doc });
  } catch (err) {
    console.error("handleQueryDoc error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ========== ค้นหาเอกสาร ==========
export const searchDocument = async (req, res) => {
  try {
    const sessionUserId = getSessionUserId(req);
    if (!sessionUserId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // ROUTE ใช้ GET -> รับจาก query
    const q = req.query?.q;
    if (q) {
      return handleQueryDoc(req, res, q); // ส่งต่อ & return เพื่อกัน response ซ้ำ
    }
    return res.json([]);
  } catch (err) {
    console.error("searchDocument error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};
