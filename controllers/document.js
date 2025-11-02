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
        Post: { select: { userId: true } },
      },
    });

    if (!documentToUpdate) {
      return res.status(404).json({ message: "Document not found" });
    }

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

      await prisma.notification.create({
        data: {
          userId: updatedDocument.userId,
          Title: "เอกสารของคุณได้รับการอนุมัติแล้ว",
          Message: `เอกสาร "${updatedDocument.DocumentName}" เอกสารได้รับการอนุมัติ กรุณาไปที่หน้าเอกสารเพื่อกดมัดจำ`,
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
    const {
      userId: buyerId,
      DocumentName: docName,
      CloudinaryPublicId: cloudinaryPublicId,
      unitId,
      id: docId, // (เพิ่ม) ดึง id ของเอกสารมาด้วย
    } = documentToUpdate;

    // (สำคัญ) 1. ลบไฟล์ออกจาก Cloudinary ก่อนเริ่ม Transaction
    if (cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(cloudinaryPublicId);
      } catch (e) {
        console.warn("Cloudinary destroy failed:", e.message);
      }
    }

    // 2. เริ่ม Transaction สำหรับงานฐานข้อมูลเท่านั้น
    await prisma.$transaction(async (tx) => {
      // 2.1 (ถ้ามี) อัปเดตสถานะยูนิตกลับเป็น AVAILABLE
      if (unitId) {
        await tx.propertyUnit.update({
          where: { id: unitId },
          data: { Status: "AVAILABLE" },
        });
      }

      // 2.2 ลบเอกสารออกจากฐานข้อมูล
      // เราไม่สามารถใช้ documentId ที่อยู่นอก Transaction ได้โดยตรง
      // จึงใช้ docId ที่เราดึงมาจาก documentToUpdate แทน
      await tx.documentUpload.delete({ where: { id: docId } });

      // 2.3 สร้าง Notification แจ้งผู้ซื้อ
      await tx.notification.create({
        data: {
          userId: buyerId,
          Title: "เอกสารของคุณถูกปฏิเสธ",
          Message: `เอกสาร "${docName}" ที่คุณส่งมาถูกปฏิเสธ สามารถส่งใหม่อีกครั้งได้`,
          Status: "UNREAD",
          relatedProcess: "DOCUMENT_REJECTION",
        },
      });
    });

    return res.json({
      message: "Document REJECTED, and the unit is now available.",
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

export const removeDocument = async (req, res) => {
  try {
    // 1. ตรวจสอบว่าผู้ใช้ล็อกอินอยู่หรือไม่
    const sessionUserId = getSessionUserId(req);
    if (!sessionUserId) {
      return res.status(401).json({ message: "Unauthorized: Please log in." });
    }

    // 2. ดึง documentId จาก URL parameters
    const { documentId } = req.params;
    if (!documentId) {
      return res.status(400).json({ message: "Document ID is required." });
    }

    // 3. ค้นหาเอกสารในฐานข้อมูล
    const document = await prisma.documentUpload.findUnique({
      where: { id: documentId },
    });

    // ถ้าไม่พบเอกสาร
    if (!document) {
      return res.status(404).json({ message: "Document not found." });
    }

    // (เพิ่ม) 4. ตรวจสอบสถานะเอกสาร: ต้องเป็น 'HIDDEN' เท่านั้น
    if (document.Review_Status !== 'HIDDEN') {
      return res.status(403).json({ message: "Forbidden: Only documents with HIDDEN status can be deleted." });
    }

    // 5. ตรวจสอบสิทธิ์: ต้องเป็นเจ้าของเอกสารเท่านั้น
    if (document.userId !== sessionUserId) {
      return res.status(403).json({ message: "Forbidden: You are not the owner of this document." });
    }

    // 6. ลบไฟล์ออกจาก Cloudinary (ถ้ามี publicId)
    if (document.CloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(document.CloudinaryPublicId);
        console.log(`Successfully deleted file from Cloudinary: ${document.CloudinaryPublicId}`);
      } catch (cloudinaryError) {
        console.warn("Failed to delete file from Cloudinary, continuing with DB deletion:", cloudinaryError.message);
      }
    }

    // 7. ลบข้อมูลเอกสารออกจากฐานข้อมูล
    await prisma.documentUpload.delete({
      where: { id: documentId },
    });

    // 8. ส่ง Response ยืนยันการลบสำเร็จ
    return res.status(200).json({ message: "Document removed successfully." });

  } catch (err) {
    console.error("removeDocument error:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
}
