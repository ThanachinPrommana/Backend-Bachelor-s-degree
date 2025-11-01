// controllers/user.js (ESM) — MERGED & SCHEMA-SAFE
// Highlights:
// - ใช้เฉพาะ Status_Seller (ตัด UserType/Status_Disposit ที่ไม่จำเป็นออก)
// - รองรับทั้ง :sellerId และ :id ใน updateStatusSeller
// - แก้การอ้างอิง session/userId ให้สม่ำเสมอ
// - ฟิลเตอร์ความสัมพันธ์ Prisma ใช้รูปแบบ { Post: { is: { ... } } }
// - getdeposits ใช้ req.session.user.userId และ include: { Post: true }
// - การสร้าง/อัปเดต/ลบ booking/slot เป็นธุรกรรมที่ปลอดภัย
// - อัปเดตสลิปสุดท้าย/ยืนยันสลิป ปรับจำนวนยูนิตและสถานะโพสต์เป็น SOLD_OUT เมื่อยูนิตหมด

import prisma from "../config/prisma.js";
import { Status_Seller } from "@prisma/client";
import cloudinary from "../utils/cloudinary.js";

/* ===================== helpers ===================== */
const getCloudinaryResourceDetails = async (publicId) => {
  try {
    const resource = await cloudinary.api.resource(publicId);
    return resource;
  } catch (error) {
    console.error("Cloudinary API error:", error);
    return null;
  }
};
const normDate = (v) => {
  if (v === "" || v === null) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
};
const normNum = (v) => {
  if (v === "" || v === null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};
const normStr = (v) => (v === "" ? null : v);

/* ==================================================== */
/* ======================= Admin ====================== */
/* ==================================================== */
export const updateStatusSeller = async (req, res) => {
  try {
    const { Status } = req.body;
    // รองรับทั้ง /:sellerId และ /:id
    const sellerId = req.params.sellerId || req.params.id;

    const normalizedStatus = Status?.toUpperCase();
    if (!normalizedStatus)
      return res.status(400).json({ message: "Status is required" });
    if (!Object.values(Status_Seller).includes(normalizedStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const existingSeller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });
    if (!existingSeller)
      return res.status(404).json({ message: "Seller not found" });

    const seller = await prisma.seller.update({
      where: { id: sellerId },
      data: { Status: normalizedStatus },
    });

    res.json(seller);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    await prisma.user.delete({ where: { id } });
    res.json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const listUserSeller = async (req, res) => {
  try {
    const listusers = await prisma.user.findMany({
      where: { userType: "Seller" },
      select: {
        id: true,
        Email: true,
        First_name: true,
        Last_name: true,
        userType: true,
        Seller: true,
        Payment: true,
      },
    });
    res.json(listusers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const listUserBuyer = async (req, res) => {
  try {
    const listusers = await prisma.user.findMany({
      where: { userType: "Buyer" },
      select: {
        id: true,
        Email: true,
        First_name: true,
        Last_name: true,
        userType: true,
        Seller: true,
        Payment: true,
      },
    });
    res.json(listusers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// (option) โปรไฟล์ผู้ขาย
export const getSellerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        First_name: true,
        Last_name: true,
        Email: true,
        image: true,
        Phone: true,
        Seller: {
          select: {
            National_ID: true,
            Company_Name: true,
            RealEstate_License: true,
            Status: true,
          },
        },
      },
    });
    if (!seller) return res.status(404).json({ message: "User not found" });
    res.json(seller);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// (option) โปรไฟล์ผู้ใช้ทั่วไป
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        First_name: true,
        Last_name: true,
        Email: true,
        image: true,
        Phone: true,
        Buyer: {
          select: {
            DateofBirth: true,
            Occupation: true,
            Monthly_Income: true,
            Family_Size: true,
            Parking_Needs: true,
            Nearby_Facilities: true,
            Lifestyle_Preferences: true,
            Special_Requirements: true,
            Preferred_District: true,
            Preferred_Province: true,
            Preferred_Subdistrict: true,
          },
        },
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ==================================================== */
/* =================== Profile Update ================= */
/* ==================================================== */
export const updateSeller = async (req, res) => {
  try {
    const sessionUser = req.session.user;
    if (!sessionUser?.userId) {
      return res
        .status(401)
        .json({
          message: "Unauthorized: Please log in to update your profile.",
        });
    }
    if (sessionUser.userType !== "Seller") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only sellers can update this profile." });
    }

    const { userId } = sessionUser;
    const bodySeller = req.body.Seller || {};
    const bodyBuyer = req.body.Buyer || {};
    const readAny = (field, group) =>
      req.body[field] !== undefined
        ? req.body[field]
        : group && group[field] !== undefined
          ? group[field]
          : undefined;

    const updated = await prisma.$transaction(async (tx) => {
      const current = await tx.user.findUnique({
        where: { id: userId },
        select: {
          Buyer: { select: { id: true } },
          Seller: { select: { id: true } },
        },
      });
      const hasBuyer = !!current?.Buyer?.id;
      const hasSeller = !!current?.Seller?.id;

      const userData = {};
      ["First_name", "Last_name", "Phone", "image"].forEach((f) => {
        if (req.body[f] !== undefined) userData[f] = normStr(req.body[f]);
      });

      const sellerPatch = {};
      for (const f of [
        "National_ID",
        "Company_Name",
        "RealEstate_License",
        "StartTime",
      ]) {
        const raw = readAny(f, bodySeller);
        if (raw === undefined) continue;
        if (f === "StartTime") {
          const d = normDate(raw);
          if (d === undefined) continue;
          sellerPatch[f] = d;
        } else {
          sellerPatch[f] = normStr(raw);
        }
      }
      if (sellerPatch.National_ID != null) {
        const digits = String(sellerPatch.National_ID).replace(/\D/g, "");
        if (digits.length !== 13)
          throw new Error("เลขบัตรประชาชนต้องมี 13 หลัก");
        sellerPatch.National_ID = digits;
      }

      const buyerPatch = {};
      for (const f of [
        "DateofBirth",
        "Occupation",
        "Monthly_Income",
        "Family_Size",
        "Parking_Needs",
        "Nearby_Facilities",
        "Lifestyle_Preferences",
        "Special_Requirements",
        "Preferred_Province",
        "Preferred_District",
        "Preferred_Subdistrict",
      ]) {
        const raw = readAny(f, bodyBuyer);
        if (raw === undefined) continue;
        if (f === "DateofBirth") {
          const d = normDate(raw);
          if (d === undefined) continue;
          buyerPatch[f] = d;
        } else if (f === "Monthly_Income" || f === "Family_Size") {
          const n = normNum(raw);
          if (n === undefined) continue;
          buyerPatch[f] = n;
        } else {
          buyerPatch[f] = normStr(raw);
        }
      }

      if (Object.keys(sellerPatch).length) {
        userData.Seller = hasSeller
          ? { update: sellerPatch }
          : (() => {
            throw new Error(
              "โปรไฟล์ผู้ขายยังไม่ถูกสร้าง กรุณากรอกเลขบัตรประชาชน 13 หลักเพื่อสร้างครั้งแรก"
            );
          })();
      }
      if (Object.keys(buyerPatch).length) {
        userData.Buyer = hasBuyer
          ? { update: buyerPatch }
          : { create: buyerPatch };
      }

      if (!Object.keys(userData).length) {
        return await tx.user.findUnique({
          where: { id: userId },
          include: { Buyer: true, Seller: true },
        });
      }
      const u = await tx.user.update({
        where: { id: userId },
        data: userData,
        include: { Buyer: true, Seller: true },
      });
      return u;
    });

    const newSession = {
      userId: updated.id,
      userType: updated.userType,
      First_name: updated.First_name,
      Last_name: updated.Last_name,
      Phone: updated.Phone,
      image: updated.image,
      buyerId: updated.Buyer?.id,
      sellerId: updated.Seller?.id,
      Buyer: updated.Buyer,
      Seller: updated.Seller,
    };
    req.session.user = newSession;
    req.session.save((err) => {
      if (err) console.error("Session update error after profile update:", err);
      res.json({
        message: "User profile updated successfully",
        user: newSession,
      });
    });
  } catch (err) {
    console.error("updateSeller error:", err);
    if (err?.code === "P2002") {
      const field = Array.isArray(err?.meta?.target)
        ? err.meta.target.join(", ")
        : err?.meta?.target || "unique field";
      return res
        .status(400)
        .json({ message: `ข้อมูลซ้ำ: ฟิลด์ ${field} ถูกใช้งานแล้ว` });
    }
    if (err?.code === "P2025") {
      return res
        .status(400)
        .json({
          message:
            "ไม่พบข้อมูลที่ต้องการอัปเดต (โปรไฟล์ผู้ขาย/ผู้ซื้ออาจยังไม่ถูกสร้าง)",
        });
    }
    if (
      typeof err?.message === "string" &&
      (err.message.includes("เลขบัตรประชาชน") ||
        err.message.includes("โปรไฟล์ผู้ขายยังไม่ถูกสร้าง"))
    ) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const sessionUser = req.session.user;
    if (!sessionUser?.userId) {
      return res
        .status(401)
        .json({
          message: "Unauthorized: Please log in to update your profile.",
        });
    }
    const { userId, buyerId } = sessionUser;

    const dataToUpdate = {};
    ["First_name", "Last_name", "Phone", "image"].forEach((field) => {
      if (req.body[field] !== undefined) dataToUpdate[field] = req.body[field];
    });

    const bodyBuyer = req.body.Buyer || {};
    const readField = (field) =>
      req.body[field] !== undefined
        ? req.body[field]
        : bodyBuyer[field] !== undefined
          ? bodyBuyer[field]
          : undefined;

    const BUYER_FIELDS = [
      "DateofBirth",
      "Occupation",
      "Monthly_Income",
      "Family_Size",
      "Parking_Needs",
      "Nearby_Facilities",
      "Lifestyle_Preferences",
      "Special_Requirements",
      "Preferred_Province",
      "Preferred_District",
      "Preferred_Subdistrict",
    ];

    const buyerDataToUpdate = {};
    for (const field of BUYER_FIELDS) {
      let value = readField(field);
      if (value === undefined) continue;
      if (field === "DateofBirth") {
        const d = normDate(value);
        if (d === undefined) continue;
        value = d;
      } else if (field === "Monthly_Income" || field === "Family_Size") {
        const n = normNum(value);
        if (n === undefined) continue;
        value = n;
      } else {
        if (value === "") value = null;
      }
      buyerDataToUpdate[field] = value;
    }

    if (Object.keys(buyerDataToUpdate).length > 0) {
      if (!buyerId)
        return res
          .status(400)
          .json({
            message: "This user does not have a buyer profile to update.",
          });
      dataToUpdate.Buyer = { update: buyerDataToUpdate };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      include: { Buyer: true, Seller: true },
    });

    const newSessionPayload = {
      userId: updatedUser.id,
      userType: updatedUser.userType,
      First_name: updatedUser.First_name,
      Last_name: updatedUser.Last_name,
      Phone: updatedUser.Phone,
      image: updatedUser.image,
      buyerId: updatedUser.Buyer?.id,
      sellerId: updatedUser.Seller?.id,
      Buyer: updatedUser.Buyer,
      Seller: updatedUser.Seller,
    };
    req.session.user = newSessionPayload;
    req.session.save((err) => {
      if (err) console.error("Session update error after profile update:", err);
      res.json({
        message: "User profile updated successfully",
        user: newSessionPayload,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =================== Image Upload =================== */
export const updateimage = async (req, res) => {
  try {
    const sess = req.session?.user;
    if (!sess?.userId)
      return res
        .status(401)
        .json({ message: "Unauthorized, please login first" });

    const file = req.file;
    if (!file) return res.status(400).json({ message: "No image uploaded" });

    const imageUrl = file.secure_url || file.path || file.url || null;
    const publicId = file.public_id || file.filename || file.publicId || null;
    if (!imageUrl) {
      console.error("Uploader returned no URL:", {
        fileKeys: Object.keys(file || {}),
      });
      return res
        .status(502)
        .json({
          message: "Upload failed: no image URL returned from uploader.",
        });
    }

    const updatedUser = await prisma.user.update({
      where: { id: sess.userId },
      data: { image: imageUrl, publicId },
    });

    req.session.user.image = updatedUser.image;
    req.session.user.publicId = updatedUser.publicId;
    req.session.save((err) => {
      if (err) console.error("Session save error after image update:", err);
      return res.status(200).json({
        message: "Image uploaded and user updated successfully",
        user: { ...req.session.user },
      });
    });
  } catch (err) {
    console.error("Upload image error:", err);
    res.status(500).json({ message: err?.message || "Internal Server Error" });
  }
};

/* =================== Documents/Deposit =============== */
export const useruploadDocument = async (req, res) => {
  try {
    const loggedInUser = req.session.user;
    if (!loggedInUser?.userId)
      return res.status(401).json({ message: "Unauthorized: Please log in." });
    const userId = loggedInUser.userId;

    const { postId, unitId } = req.body;

    // (แก้ไข) เปลี่ยนจาก req.file เป็น req.files (ซึ่งเป็น Array)
    const files = req.files;
    if (!files || files.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    if (!unitId)
      return res.status(400).json({ message: "A specific unit ID is required." });

    const resultDocuments = await prisma.$transaction(async (tx) => {
      // --- ทำส่วนที่เกี่ยวกับ Unit แค่ครั้งเดียว ---
      const unit = await tx.propertyUnit.findUnique({ where: { id: unitId } });
      if (!unit || unit.Status !== "AVAILABLE")
        throw new Error("This unit is no longer available.");

      await tx.propertyUnit.update({
        where: { id: unitId },
        data: { Status: "PENDING" },
      });
      // ------------------------------------------

      // (สำคัญ) สร้าง Array ของ Promises สำหรับการสร้าง Document แต่ละไฟล์
      const createDocumentPromises = files.map(file => {
        const documentUrl = file.secure_url || file.path || file.url;
        const publicId = file.filename || file.public_id;

        return tx.documentUpload.create({
          data: {
            userId,
            DocumentName: file.originalname || "document", // ใช้ชื่อไฟล์แต่ละอัน
            DocumentUrl: documentUrl,
            CloudinaryPublicId: publicId,
            Review_Status: "PENDING",
            postId,
            unitId,
          },
        });
      });

      // รอให้การสร้าง Document ทั้งหมดเสร็จสิ้น
      const createdDocuments = await Promise.all(createDocumentPromises);

      // --- สร้าง Notification แค่ครั้งเดียว ---
      const post = await tx.propertyPost.findUnique({
        where: { id: postId },
        select: { userId: true },
      });
      if (!post) throw new Error("Post not found");

      // สร้าง Notification สำหรับ Seller
      await tx.notification.create({
        data: {
          userId: post.userId,
          Title: "มีเอกสารใหม่สำหรับตรวจสอบมัดจำ",
          Message: `${files.length} เอกสารถูกส่งจาก: ${loggedInUser.First_name} สำหรับยูนิต #${unit.Unit_Number}`,
          relatedProcess: "DOCUMENT_UPLOAD",
          referenceId: unitId, // อ้างอิงถึง unitId แทน documentId
          Status: "UNREAD", // (เพิ่ม) กำหนดสถานะเริ่มต้น
        },
      });

      // สร้าง Notification สำหรับ Buyer
      await tx.notification.create({
        data: {
          userId,
          Title: "เอกสารของคุณถูกส่งไปยังผู้ขายแล้ว",
          Message: `ส่งเอกสาร ${files.length} ฉบับสำหรับยูนิต #${unit.Unit_Number} สำเร็จ`,
          relatedProcess: "DOCUMENT_UPLOAD",
          referenceId: unitId,
          Status: "UNREAD", // (เพิ่ม) กำหนดสถานะเริ่มต้น
        },
      });
      // ------------------------------------------

      return createdDocuments; // ส่งคืน Array ของเอกสารที่สร้าง
    });

    res.json({
      message: `${resultDocuments.length} files uploaded successfully and notification sent`,
      documents: resultDocuments,
    });
  } catch (err) {
    console.log(err);
    const message = err.message || "Server Error";
    res.status(500).json({ message });
  }
};

export const getdeposits = async (req, res) => {
  try {
    const userId = req.session.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const deposits = await prisma.deposit.findMany({
      where: { userId },
      include: { Post: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ deposits });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getpostBySeller = async (req, res) => {
  try {
    const userFromSession = req.session.user;
    if (!userFromSession)
      return res.status(401).json({ message: "Unauthorized" });

    const { sellerId, userId } = userFromSession;
    const where = sellerId ? { sellerId } : { userId };

    const posts = await prisma.propertyPost.findMany({
      where,
      select: {
        id: true,
        Property_Name: true,
        Price: true,
        Status_post: true,
        Address: true,
        Province: true,
        District: true,
        Image: { take: 1, select: { url: true } },
        Category: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ message: "Success", posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deletePostBySeller = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!req.session.user?.userId)
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    const { userId, userType } = req.session.user;
    if (userType !== "Seller")
      return res
        .status(403)
        .json({ message: "Forbidden. Only sellers can delete posts." });

    const postToDelete = await prisma.propertyPost.findUnique({
      where: { id: postId },
      include: {
        Image: { select: { public_id: true } },
        Video: { select: { public_id: true } },
      },
    });
    if (!postToDelete)
      return res.status(404).json({ message: "Post not found." });
    if (postToDelete.userId !== userId)
      return res
        .status(403)
        .json({ message: "Forbidden. You are not the owner of this post." });

    if (postToDelete.Image?.length) {
      const imagePublicIds = postToDelete.Image.map(
        (img) => img.public_id
      ).filter(Boolean);
      if (imagePublicIds.length > 0) {
        try {
          await cloudinary.api.delete_resources(imagePublicIds);
        } catch (e) {
          console.warn("Cloudinary cleanup warn (images):", e?.message);
        }
      }
    }
    if (postToDelete.Video?.length) {
      const videoPublicIds = postToDelete.Video.map((v) => v.public_id).filter(
        Boolean
      );
      if (videoPublicIds.length > 0) {
        try {
          await cloudinary.api.delete_resources(videoPublicIds, {
            resource_type: "video",
          });
        } catch (e) {
          console.warn("Cloudinary cleanup warn (videos):", e?.message);
        }
      }
    }

    await prisma.$transaction([
      prisma.image.deleteMany({ where: { propertyPostId: postId } }),
      prisma.video.deleteMany({ where: { postId } }),
      prisma.propertyPost.delete({ where: { id: postId } }),
    ]);

    res.status(200).json({ message: "Delete Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const searchFiltersSeller = async (req, res) => {
  try {
    if (!req.session.user?.userId)
      return res
        .status(401)
        .json({ success: false, message: "กรุณาเข้าสู่ระบบก่อน" });
    const { userType, sellerId } = req.session.user;
    if (userType !== "Seller" || !sellerId)
      return res
        .status(403)
        .json({
          success: false,
          message: "Forbidden: Only sellers can access this resource.",
        });

    const { q } = req.query;
    const whereClause = { sellerId };
    if (q) {
      whereClause.OR = [
        { Property_Name: { contains: q, mode: "insensitive" } },
        { Year_Built: { contains: q, mode: "insensitive" } },
        { Description: { contains: q, mode: "insensitive" } },
        { Address: { contains: q, mode: "insensitive" } },
        { Province: { contains: q, mode: "insensitive" } },
        { District: { contains: q, mode: "insensitive" } },
        { Subdistrict: { contains: q, mode: "insensitive" } },
      ];
    }

    const posts = await prisma.propertyPost.findMany({
      where: whereClause,
      include: { Category: true, Image: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    console.error("Error in searchFiltersSeller:", err);
    res
      .status(500)
      .json({ success: false, message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};

export const createdeposite = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user?.userId)
      return res
        .status(401)
        .json({ message: "Unauthorized: Please log in to make a deposit." });

    const userId = user.userId;
    const { postId, documentId } = req.body;
    if (!postId || !documentId)
      return res
        .status(400)
        .json({
          message:
            "Missing required fields: postId and documentId are required.",
        });

    const post = await prisma.propertyPost.findUnique({
      where: { id: postId },
      select: { userId: true, Deposit_Amount: true },
    });
    if (!post) return res.status(404).json({ message: "Post not found." });
    if (!post.Deposit_Amount || post.Deposit_Amount <= 0)
      return res
        .status(400)
        .json({ message: "This post does not require a deposit." });

    const document = await prisma.documentUpload.findUnique({
      where: { id: documentId },
    });
    if (!document)
      return res
        .status(404)
        .json({ message: "Associated document not found." });
    if (document.userId !== userId)
      return res
        .status(403)
        .json({
          message: "Action forbidden: Document does not belong to you.",
        });
    if (document.Review_Status !== "APPROVED")
      return res.status(403).json({
        message: `Action forbidden: Document status is '${document.Review_Status}', not 'APPROVED'.`,
      });

    const existingDeposit = await prisma.deposit.findFirst({
      where: { postId, Deposit_Status: { in: ["PENDING", "CONFIRMED"] } },
    });
    if (existingDeposit)
      return res.status(409).json({
        message:
          "ไม่สามารถทำรายการได้ เนื่องจากมีผู้ทำรายการมัดจำสำหรับโพสต์นี้อยู่แล้วหรือมัดจำสำเร็จแล้ว",
      });

    const newDeposit = await prisma.$transaction(async (tx) => {
      const deposit = await tx.deposit.create({
        data: {
          postId,
          userId,
          Deposit_Amount: post.Deposit_Amount,
          Deposit_Status: "PENDING",
        },
      });
      await tx.documentUpload.update({
        where: { id: documentId },
        data: { depositId: deposit.id },
      });
      return deposit;
    });

    await prisma.notification.create({
      data: {
        userId: post.userId,
        Title: "คุณได้รับการชำระเงินมัดจำใหม่",
        Message: `ผู้ใช้ ${user.First_name} ได้ชำระเงินมัดจำสำหรับโพสต์ของคุณ`,
        Status: "UNREAD",
        relatedProcess: "DEPOSIT_RECEIVED",
        referenceId: newDeposit.id,
      },
    });
    await prisma.notification.create({
      data: {
        userId,
        Title: "การชำระเงินมัดจำสำเร็จ",
        Message: "ระบบได้บันทึกการชำระเงินมัดจำของคุณแล้ว รอการยืนยันจากผู้ขาย",
        Status: "UNREAD",
        relatedProcess: "DEPOSIT_PAID",
        referenceId: newDeposit.id,
      },
    });

    res.status(201).json({
      message: "Deposit created successfully. Waiting for seller confirmation.",
      deposit: newDeposit,
    });
  } catch (err) {
    console.error("Error creating deposit:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateDepositStatus = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user?.userId)
      return res.status(401).json({ message: "Unauthorized: โปรดเข้าสู่ระบบ" });
    if (user.userType !== "Seller")
      return res
        .status(403)
        .json({
          message: "Forbidden: Only sellers can update deposit status.",
        });

    const sellerUserId = user.userId;
    const { depositId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["CONFIRMED", "REJECTED"];
    if (!status || !allowedStatuses.includes(status))
      return res.status(400).json({
        message: `Invalid status: สถานะต้องเป็น ${allowedStatuses.join(
          " หรือ "
        )} เท่านั้น`,
      });

    const result = await prisma.$transaction(async (tx) => {
      const deposit = await tx.deposit.findUnique({
        where: { id: depositId },
        include: { Post: { select: { userId: true } } },
      });
      if (!deposit) throw new Error("Deposit not found: ไม่พบรายการมัดจำนี้");
      const postOwnerId = deposit.Post?.userId;
      if (postOwnerId !== sellerUserId)
        throw new Error("Forbidden: คุณไม่มีสิทธิ์ในการจัดการรายการมัดจำนี้");
      if (deposit.Deposit_Status !== "PENDING")
        throw new Error(
          `Conflict: รายการมัดจำนี้ไม่ได้อยู่ในสถานะ PENDING (สถานะปัจจุบัน: ${deposit.Deposit_Status})`
        );

      const updatedDeposit = await tx.deposit.update({
        where: { id: depositId },
        data: { Deposit_Status: status },
      });
      const buyerId = updatedDeposit.userId;

      const meta =
        status === "CONFIRMED"
          ? {
            Title: "การมัดจำของคุณได้รับการยืนยันแล้ว",
            Message:
              "ผู้ขายได้ยืนยันการชำระเงินมัดจำสำหรับโพสต์เรียบร้อยแล้ว",
            relatedProcess: "DEPOSIT_CONFIRMED",
          }
          : {
            Title: "การมัดจำของคุณถูกปฏิเสธ",
            Message:
              "ผู้ขายได้ปฏิเสธการมัดจำของคุณ กรุณาติดต่อผู้ขายเพื่อสอบถามรายละเอียดเพิ่มเติม",
            relatedProcess: "DEPOSIT_REJECTED",
          };

      await tx.notification.create({
        data: {
          userId: buyerId,
          Title: meta.Title,
          Message: meta.Message,
          Status: "UNREAD",
          relatedProcess: meta.relatedProcess,
          referenceId: updatedDeposit.id,
        },
      });
      return updatedDeposit;
    });

    res.status(200).json({
      message: `Deposit status updated to ${status} successfully.`,
      deposit: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// FE compatibility name
export const searchFillerDiposit = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user?.userId)
      return res
        .status(401)
        .json({ success: false, message: "กรุณาเข้าสู่ระบบก่อน" });
    const userId = user.userId;

    const { q, status, minAmount, maxAmount } = req.body;
    const where = { userId };

    if (q) {
      // prisma relation filter
      where.Post = {
        is: { Property_Name: { contains: q, mode: "insensitive" } },
      };
    }

    const ALLOWED_DEPOSIT_STATUS = ["PENDING", "CONFIRMED", "REJECTED"];
    if (status && ALLOWED_DEPOSIT_STATUS.includes(status))
      where.Deposit_Status = status;

    if (minAmount || maxAmount) {
      where.Deposit_Amount = {};
      if (minAmount) where.Deposit_Amount.gte = parseFloat(minAmount);
      if (maxAmount) where.Deposit_Amount.lte = parseFloat(maxAmount);
    }

    const deposits = await prisma.deposit.findMany({
      where,
      include: { Post: { select: { id: true, Property_Name: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ message: "Success", data: deposits });
  } catch (err) {
    console.error("Error searching user deposits:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ================== DateTimeSlot & Booking =========== */
export const createDateTimeSlot = async (req, res) => {
  if (!req.session?.user)
    return res
      .status(401)
      .json({ message: "Unauthorized: กรุณาเข้าสู่ระบบก่อน" });
  const sellerId = req.session.user.sellerId;
  if (!sellerId)
    return res
      .status(403)
      .json({ message: "Forbidden: คุณไม่มีสิทธิ์ในการสร้างช่วงเวลา" });

  const { date, timeSlots, postId, documentUploadId } = req.body;
  if (!postId)
    return res.status(400).json({ message: "กรุณาระบุ postId ของทรัพย์สิน" });
  if (!documentUploadId)
    return res.status(400).json({ message: "กรุณาระบุ documentUploadId ของเอกสารมัดจำ" });
  if (!date || !Array.isArray(timeSlots) || timeSlots.length === 0)
    return res
      .status(400)
      .json({
        message: "กรุณาระบุ date (YYYY-MM-DD) และ timeSlots ที่เป็น array",
      });

  try {
    const post = await prisma.propertyPost.findUnique({
      where: { id: postId },
    });
    if (!post)
      return res
        .status(404)
        .json({ message: `ไม่พบ PropertyPost ที่มี ID: ${postId}` });
    if (post.sellerId !== sellerId)
      return res
        .status(403)
        .json({ message: "Forbidden: คุณไม่ใช่เจ้าของโพสต์นี้" });

    // 5. --- (Optional แต่แนะนำ) ตรวจสอบ DocumentUpload ---
    const document = await prisma.documentUpload.findUnique({
      where: { id: documentUploadId },
      select: { postId: true, userId: true /* อาจจะ select ข้อมูลอื่น ๆ เพิ่มเติม */ },
    });
    if (!document)
      return res
        .status(404)
        .json({ message: `ไม่พบ DocumentUpload ที่มี ID: ${documentUploadId}` });
    // ตรวจสอบว่าเอกสารเชื่อมโยงกับ Post ID ที่ถูกต้อง
    if (document.postId !== postId)
      return res
        .status(400)
        .json({ message: "เอกสารที่เลือกไม่ตรงกับโพสต์ที่ระบุ" });
    // (เพิ่มเติม) อาจจะตรวจสอบสถานะของเอกสาร (Review_Status) หรือ Deposit ที่เกี่ยวข้องก็ได้

    // 6. --- (เพิ่ม) ตรวจสอบว่า date ไม่ใช่อดีต (เหมือนที่เคยทำ) ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(date + "T00:00:00");
    if (isNaN(inputDate.getTime())) {
      return res.status(400).json({ message: `รูปแบบวันที่ '${date}' ไม่ถูกต้อง` });
    }
    if (inputDate < today) {
      return res.status(400).json({ message: "ไม่สามารถสร้างช่วงเวลาในอดีตได้" });
    }

    const slotsToCreate = [];
    for (const slot of timeSlots) {
      if (!slot.startTime || !slot.endTime)
        throw new Error(
          "ข้อมูลใน timeSlots ไม่สมบูรณ์ กรุณาระบุ startTime และ endTime"
        );
      const startDate = new Date(`${date}T${slot.startTime}:00`);
      const endDate = new Date(`${date}T${slot.endTime}:00`);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
        throw new Error(
          `รูปแบบเวลาไม่ถูกต้อง: ${slot.startTime}-${slot.endTime}`
        );
      if (startDate >= endDate)
        throw new Error(
          `เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น: ${slot.startTime}-${slot.endTime}`
        );

      const now = new Date();
      if (inputDate.toDateString() === today.toDateString() && startDate < now) {
        throw new Error(`ไม่สามารถสร้างช่วงเวลา ${slot.startTime}-${slot.endTime} ในอดีตของวันนี้ได้`);
      }

      const existingSlot = await prisma.dateTimeSlot.findFirst({
        where: {
          postId,
          AND: [{ startTime: { lt: endDate } }, { endTime: { gt: startDate } }],
        },
      });
      if (existingSlot)
        throw new Error(
          `ช่วงเวลา ${slot.startTime}-${slot.endTime} ทับซ้อนกับ Slot ของโพสต์นี้ที่มีอยู่แล้ว`
        );

      slotsToCreate.push({
        startTime: startDate,
        endTime: endDate,
        sellerId,
        postId,
        documentUploadId: documentUploadId,
      });
    }
    // กันทับซ้อนใน payload เอง
    for (let i = 0; i < slotsToCreate.length; i++) {
      for (let j = i + 1; j < slotsToCreate.length; j++) {
        const a = slotsToCreate[i],
          b = slotsToCreate[j];
        if (a.startTime < b.endTime && a.endTime > b.startTime)
          throw new Error("ข้อมูลช่วงเวลาที่ส่งมาทับซ้อนกันเอง");
      }
    }

    const result = await prisma.dateTimeSlot.createMany({
      data: slotsToCreate,
    });
    res
      .status(201)
      .json({
        message: `สร้างช่วงเวลาสำหรับโพสต์ ID: ${postId} สำเร็จ ${result.count} รายการ`,
        count: result.count,
      });
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
};

export const createBooking = async (req, res) => {
  if (!req.session.user?.userId || !req.session.user?.userType)
    return res
      .status(401)
      .json({ message: "Unauthorized: กรุณาเข้าสู่ระบบก่อน" });

  const {
    userType: bookerUserType,
    buyerId: sessionBuyerId,
    sellerId: sessionSellerId,
    userId: sessionUserId,
  } = req.session.user;
  const { dateTimeSlotId, unitId, buyerId: buyerIdFromRequest } = req.body;
  if (!dateTimeSlotId || !unitId)
    return res
      .status(400)
      .json({ message: "กรุณาระบุ dateTimeSlotId และ unitId" });

  try {
    const { booking: newBooking, documentsToDelete } = await prisma.$transaction(
      async (tx) => {
        const slot = await tx.dateTimeSlot.findUnique({
          where: { id: dateTimeSlotId },
          select: { id: true, isBooked: true, postId: true, sellerId: true },
        });
        const unit = await tx.propertyUnit.findUnique({
          where: { id: unitId },
          select: { id: true, propertyPostId: true },
        });

        if (!slot || !unit) throw new Error("NOT_FOUND");

        const postId = unit.propertyPostId;

        if (slot.isBooked) throw new Error("ALREADY_BOOKED");

        if (slot.postId !== postId) // (แนะนำ) ใช้ตัวแปร postId ที่สร้างขึ้นมาใหม่
          throw new Error("SLOT_UNIT_MISMATCH");

        let buyerId;

        const sellerId = slot.sellerId;

        if (bookerUserType === "Buyer") {
          // กรณีผู้จองเป็น Buyer
          if (!sessionBuyerId) throw new Error("INVALID_BUYER_SESSION");
          buyerId = sessionBuyerId;

        } else if (bookerUserType === "Seller") {
          // กรณีผู้จองเป็น Seller (ไม่เช็คว่าเป็นเจ้าของหรือไม่)

          // ลบการตรวจสอบ FORBIDDEN ออกตามที่ร้องขอ
          // if (sellerId !== sessionSellerId) {
          //   throw new Error("FORBIDDEN");
          // }

          // หา buyerId:
          // 1. ใช้ ID จาก Request (ถ้า Seller จองให้คนอื่น)
          // 2. ใช้ ID จาก Session (ถ้า Seller จองให้ตัวเอง)
          buyerId = buyerIdFromRequest || sessionBuyerId;

          // ตรวจสอบสุดท้าย: ถ้าหา buyerId ไม่ได้เลย
          if (!buyerId) {
            throw new Error("BUYER_ID_MISSING");
          }

        } else {
          // User Type อื่นๆ ไม่สามารถจองได้
          throw new Error("INVALID_USER_TYPE");
        }

        await tx.dateTimeSlot.update({
          where: { id: dateTimeSlotId },
          data: { isBooked: true },
        });
        const booking = await tx.booking.create({
          data: { buyerId, sellerId, dateTimeSlotId, propertyUnitId: unitId },
        });

        const whereClause = {
          userId: sessionUserId, // ⭐️ (แก้ไข) ใช้ sessionUserId ที่ดึงมา
          postId: postId,
          unitId: unitId
        };

        const documentsToDeleteDetails = await tx.documentUpload.findMany({
          where: whereClause,
          select: { id: true, CloudinaryPublicId: true }
        });

        if (documentsToDeleteDetails.length > 0) {
          const documentIdsToDelete = documentsToDeleteDetails.map(d => d.id);

          // 2. (เพิ่ม) ⭐️ "ตัดการเชื่อมโยง" Foreign Key ใน DateTimeSlot
          // โดยตั้งค่า documentUploadId ให้เป็น null
          await tx.dateTimeSlot.updateMany({
            where: {
              documentUploadId: { in: documentIdsToDelete }
            },
            data: {
              documentUploadId: null
            }
          });

          // 3. (เดิม) ลบเอกสารออกจากฐานข้อมูล (ตอนนี้ทำได้แล้ว)
          await tx.documentUpload.deleteMany({
            where: whereClause
          });
        }
        // ===================================================

        // 2. ลบเอกสารออกจากฐานข้อมูล
        await tx.documentUpload.deleteMany({
          where: whereClause
        });

        // 2. ลบเอกสารออกจากฐานข้อมูล
        await tx.documentUpload.deleteMany({
          where: whereClause
        });

        // await tx.documentUpload.updateMany({
        //   where: {
        //     userId: req.session.user.userId,
        //     postId: postId,
        //     unitId: unitId
        //   },
        //   data: {
        //     Review_Status: "HIDDEN",
        //   }
        // })

        return { booking, documentsToDelete: documentsToDeleteDetails };
        // return booking;
      },
      { timeout: 10000 }
    );
    
    // 5. (เดิม) ลบไฟล์ออกจาก Cloudinary *หลังจาก* ที่ Transaction สำเร็จ
    if (documentsToDelete && documentsToDelete.length > 0) {
      const publicIds = documentsToDelete
        .map(doc => doc.CloudinaryPublicId)
        .filter(Boolean);

      if (publicIds.length > 0) {
        console.log(`[Booking Success] Cleaning up ${publicIds.length} files from Cloudinary...`);
        try {
          await cloudinary.api.delete_resources(publicIds);
        } catch (cleanupError) {
          console.warn("Cloudinary cleanup failed after booking:", cleanupError.message);
        }
      }
    }

    res
      .status(201)
      .json({ message: "การจองนัดหมายสำเร็จ", booking: newBooking });
  } catch (error) {
    if (error.message === "NOT_FOUND")
      return res
        .status(404)
        .json({ message: "ไม่พบช่วงเวลาหรือยูนิตที่คุณต้องการจอง" });
    if (error.message === "ALREADY_BOOKED")
      return res
        .status(409)
        .json({ message: "ขออภัย ช่วงเวลานี้ถูกจองไปแล้ว" });
    if (error.message === "SLOT_UNIT_MISMATCH")
      return res
        .status(400)
        .json({ message: "ข้อมูลช่วงเวลาและยูนิตไม่ตรงกัน" });
    // if (error.message === "FORBIDDEN")
    //   return res.status(403).json({ message: "คุณไม่มีสิทธิ์จองช่วงเวลานี้" });
    if (error.message === "BUYER_ID_MISSING")
      return res
        .status(400)
        .json({ message: "ไม่สามารถระบุผู้ซื้อสำหรับการจองนี้ได้" });
    if (error.message === "INVALID_BUYER_SESSION")
      return res
        .status(401)
        .json({ message: "เซสชั่นผู้ซื้อไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่" });
    console.error("เกิดข้อผิดพลาดในการสร้าง Booking:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
};

export const revmovedeposit = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user?.userId)
      return res
        .status(401)
        .json({ message: "Unauthorized: กรุณาเข้าสู่ระบบก่อน" });
    const userName = `${user.First_name} ${user.Last_name}`;
    const userId = user.userId;
    const { id: depositId } = req.params;

    const deposit = await prisma.deposit.findUnique({
      where: { id: depositId },
      include: {
        Post: { select: { id: true, Property_Name: true, userId: true } },
      },
    });
    if (!deposit)
      return res
        .status(404)
        .json({ message: "ไม่พบรายการมัดจำที่คุณต้องการลบ" });
    if (deposit.userId !== userId)
      return res
        .status(403)
        .json({ message: "Forbidden: คุณไม่มีสิทธิ์ในการลบรายการมัดจำนี้" });
    if (deposit.Deposit_Status !== "PENDING")
      return res.status(409).json({
        message: `ไม่สามารถลบได้ เนื่องจากรายการมัดจำนี้อยู่ในสถานะ "${deposit.Deposit_Status}" แล้ว`,
      });

    await prisma.$transaction(async (tx) => {
      await tx.documentUpload.updateMany({
        where: { depositId },
        data: { depositId: null },
      });
      await tx.deposit.delete({ where: { id: depositId } });
      await tx.notification.create({
        data: {
          userId: deposit.Post.userId,
          Title: "มีการยกเลิกการมัดจำ",
          Message: `ผู้ใช้ ${userName} ได้ยกเลิกการมัดจำสำหรับโพสต์ "${deposit.Post.Property_Name}" ของคุณ`,
          Status: "UNREAD",
          relatedProcess: "DEPOSIT_CANCELLED",
          referenceId: deposit.Post.id,
        },
      });
    });

    res.json({ message: "ลบรายการมัดจำสำเร็จ", deleteDeposit: deposit });
  } catch (err) {
    console.error("Error removing deposit:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};

export const removeTimeSlot = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user?.userId || user.userType !== "Seller")
      return res
        .status(403)
        .json({
          message: "Forbidden: เฉพาะผู้ขายเท่านั้นที่สามารถลบช่วงเวลาได้",
        });
    const sellerId = user.sellerId;
    if (!sellerId)
      return res
        .status(403)
        .json({ message: "Forbidden: ข้อมูลผู้ขายไม่สมบูรณ์" });

    const { timeSlotId } = req.params;
    const timeSlot = await prisma.dateTimeSlot.findUnique({
      where: { id: timeSlotId },
    });
    if (!timeSlot)
      return res.status(404).json({ message: "ไม่พบช่วงเวลาที่ต้องการลบ" });
    if (timeSlot.sellerId !== sellerId)
      return res
        .status(403)
        .json({
          message: "Forbidden: คุณไม่มีสิทธิ์ลบช่วงเวลาของผู้ขายท่านอื่น",
        });

    const deletedSlot = await prisma.$transaction(async (tx) => {
      await tx.booking.deleteMany({ where: { dateTimeSlotId: timeSlotId } });
      const result = await tx.dateTimeSlot.delete({
        where: { id: timeSlotId },
      });
      return result;
    });

    res
      .status(200)
      .json({
        message: "ลบช่วงเวลาและข้อมูลการจองที่เกี่ยวข้องสำเร็จ",
        deletedSlot,
      });
  } catch (err) {
    console.error("Error removing time slot:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};

export const removeBooking = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user?.userId)
      return res
        .status(401)
        .json({ message: "Unauthorized: กรุณาเข้าสู่ระบบก่อน" });
    const { userId, First_name, Last_name } = user;
    const userName = `${First_name} ${Last_name}`;
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        Buyer: { select: { userId: true } },
        Seller: { select: { userId: true } },
        dateTimeSlot: { select: { id: true, startTime: true } },
      },
    });
    if (!booking) return res.status(404).json({ message: "ไม่พบข้อมูลการจอง" });

    const unitIdToUpdate = booking.propertyUnitId;
    const isBuyer = booking.Buyer.userId === userId;
    const isSeller = booking.Seller.userId === userId;
    if (!isBuyer && !isSeller)
      return res
        .status(403)
        .json({ message: "Forbidden: คุณไม่มีสิทธิ์ในการยกเลิกการจองนี้" });

    const deletedBooking = await prisma.$transaction(async (tx) => {
      await tx.dateTimeSlot.update({
        where: { id: booking.dateTimeSlot.id },
        data: { isBooked: false },
      });

      if (unitIdToUpdate && booking.bookingStatus !== 'COMPLETED') { // <-- Added condition here
        await tx.documentUpload.updateMany({
          where: {
            userId: userId, // Document owner (the one deleting)
            unitId: unitIdToUpdate, // Related to this booking's unit
          },
          data: {
            Review_Status: "APPROVED", // Set back to APPROVED
          },
        });
      }

      const result = await tx.booking.delete({ where: { id: bookingId } });

      let notificationRecipientId;
      let notificationMessage;
      const appointmentTime = new Date(
        booking.dateTimeSlot.startTime
      ).toLocaleString("th-TH");
      if (isBuyer) {
        notificationRecipientId = booking.Seller.userId;
        notificationMessage = `ผู้ใช้ ${userName} ได้ยกเลิกการนัดหมายในวันที่ ${appointmentTime}`;
      } else {
        notificationRecipientId = booking.Buyer.userId;
        notificationMessage = `ผู้ขาย ${userName} ได้ยกเลิกการนัดหมายของคุณในวันที่ ${appointmentTime}`;
      }

      await tx.notification.create({
        data: {
          userId: notificationRecipientId,
          Title: "มีการยกเลิกการนัดหมาย",
          Message: notificationMessage,
          relatedProcess: "BOOKING_CANCELLED",
          referenceId: booking.dateTimeSlot.id,
          Status: "UNREAD",
        },
      });
      return result;
    });

    res.json({ message: "ยกเลิกการจองสำเร็จ", deletedBooking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= Final Slip Flow ================== */
export const uploadFinalSlip = async (req, res) => {
  const { bookingId } = req.params;
  const { userId, First_name } = req.session.user;
  if (!req.file) return res.status(400).json({ message: "กรุณาแนบไฟล์สลิป" });

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        Buyer: { select: { userId: true } },
        Seller: { select: { userId: true } },
      },
    });
    if (!booking) return res.status(404).json({ message: "ไม่พบข้อมูลการจอง" });
    if (booking.Buyer.userId !== userId)
      return res
        .status(403)
        .json({ message: "คุณไม่มีสิทธิ์อัปโหลดสลิปสำหรับการจองนี้" });
    if (
      ["PENDING_FINAL_VERIFICATION", "COMPLETED"].includes(
        booking.bookingStatus
      )
    )
      return res
        .status(409)
        .json({ message: "คุณได้อัปโหลดสลิปสุดท้ายไปแล้ว" });

    const fileUrl = req.file.path;

    const [updatedBooking] = await prisma.$transaction(
      [
        prisma.booking.update({
          where: { id: bookingId },
          data: {
            finalSlipUrl: fileUrl,
            finalSlipUploadDate: new Date(),
            bookingStatus: "PENDING_FINAL_VERIFICATION",
          },
        }),
        prisma.notification.create({
          data: {
            userId: booking.Seller.userId,
            referenceId: bookingId,
            Title: "สลิปการชำระเงินส่วนที่เหลือถูกส่งมาแล้ว",
            Message: `คุณ ${First_name} ได้อัปโหลดสลิปสุดท้ายแล้ว กรุณาตรวจสอบ`,
            Status: "UNREAD",
            relatedProcess: "FINAL_SLIP_UPLOADED",
          },
        }),
      ],
      { timeout: 10000 }
    );

    res.status(200).json({
      message: "อัปโหลดสลิปสำเร็จ! กรุณารอการยืนยันจากผู้ขาย",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error uploading final slip:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปโหลดสลิป" });
  }
};

export const confirmedSlipBySeller = async (req, res) => {
  try {
    const { bookingId } = req.params;
    // (เพิ่ม) รับค่า status จาก body
    const { bookingStatus } = req.body;
    const { userId, First_name } = req.session.user; // (เพิ่ม) ดึง First_name มาใช้
    // --- Log ที่ 1: ดูว่า Server ได้รับอะไร ---
    console.log("Received request body:", req.body);
    console.log("Extracted bookingStatus:", bookingStatus);

    // --- การตรวจสอบเบื้องต้น (เหมือนเดิม) ---
    if (bookingStatus !== 'COMPLETED' && bookingStatus !== 'CANCELLED') {
      return res.status(400).json({ message: "กรุณาระบุสถานะที่ต้องการอัปเดต (COMPLETED หรือ CANCELLED)" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        Buyer: { select: { userId: true, user: { select: { First_name: true } } } }, // ดึงชื่อ Buyer มาด้วย
        Seller: { select: { userId: true } },
        propertyUnit: { include: { propertyPost: true } },
      },
    });

    // ... การตรวจสอบ booking, propertyUnit, sellerId, bookingStatus (เหมือนเดิม) ...
    if (booking.bookingStatus !== "PENDING_FINAL_VERIFICATION") // ตรวจสอบสถานะเดิม
      return res.status(400).json({ /* ... */ });

    // --- แยก Logic ตาม status ที่ได้รับ ---
    if (bookingStatus === 'CANCELLED') {
      // === กรณีปฏิเสธสลิป ===
      const [updatedBooking] = await prisma.$transaction([
        prisma.booking.update({
          where: { id: bookingId },
          // (สำคัญ) เปลี่ยนสถานะกลับไปเป็น CONFIRMED เพื่อให้ Buyer อัปโหลดใหม่ได้
          // หรือจะสร้างสถานะใหม่เช่น 'FINAL_SLIP_REJECTED' ก็ได้ แล้วแต่การออกแบบ
          data: {
            bookingStatus: "CONFIRMED",
            finalSlipUrl: null, // ล้าง URL สลิปเก่า (Optional)
            finalSlipUploadDate: null // ล้างวันที่อัปโหลดเก่า (Optional)
          },
        }),
        prisma.notification.create({
          data: {
            userId: booking.Buyer.userId,
            referenceId: bookingId,
            Title: "สลิปสุดท้ายของคุณไม่ถูกต้อง",
            Message: `ผู้ขาย ${First_name} ได้ตรวจสอบและพบว่าสลิปสุดท้ายที่คุณส่งมาไม่ถูกต้อง กรุณาอัปโหลดใหม่อีกครั้งสำหรับยูนิต #${booking.propertyUnit.Unit_Number}`,
            Status: "UNREAD",
            relatedProcess: "FINAL_SLIP_REJECTED", // สถานะ Notification ใหม่
          },
        }),
      ]);

      return res.status(200).json({
        message: "ปฏิเสธสลิปเรียบร้อยแล้ว แจ้งเตือนผู้ซื้อให้ส่งใหม่",
        booking: updatedBooking,
      });

    } else {
      // === กรณีอนุมัติสลิป (COMPLETED) - Logic เดิม ===
      const unitToUpdate = booking.propertyUnit;
      const postToUpdate = booking.propertyUnit.propertyPost;
      const newPostStatus = postToUpdate.NumberOfUnits - 1 <= 0 ? "SOLD_OUT" : postToUpdate.Status_post;

      const [updatedUnit, updatedPost, updatedBooking] = await prisma.$transaction([
        prisma.propertyUnit.update({ where: { id: unitToUpdate.id }, data: { Status: "SOLD" } }),
        prisma.propertyPost.update({ where: { id: postToUpdate.id }, data: { NumberOfUnits: { decrement: 1 }, Status_post: newPostStatus } }),
        prisma.booking.update({ where: { id: bookingId }, data: { bookingStatus: "COMPLETED" } }),
        prisma.notification.create({
          data: {
            userId: booking.Buyer.userId,
            referenceId: bookingId,
            Title: "การชำระเงินได้รับการยืนยันแล้ว",
            Message: `ผู้ขายได้ยืนยันสลิปของคุณสำหรับยูนิต #${unitToUpdate.Unit_Number} แล้ว กระบวนการเสร็จสมบูรณ์`,
            Status: "UNREAD",
            relatedProcess: "BOOKING_COMPLETED",
          },
        }),
      ]);

      return res.status(200).json({
        message: "ยืนยันสลิปและปิดการขายยูนิตสำเร็จ!",
        booking: updatedBooking,
        unit: updatedUnit,
        post: updatedPost,
      });
    }
  } catch (err) {
    console.error("Error confirming/rejecting slip:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};

/* ============== Search DateTimeSlot for Seller ============== */
export const searchFilterDateTimeSlot = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user?.userId)
      return res
        .status(401)
        .json({ success: false, message: "กรุณาเข้าสู่ระบบก่อน" });
    const sellerId = user.sellerId;
    if (!sellerId)
      return res
        .status(403)
        .json({ success: false, message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้" });

    const { q, date, isBooked } = req.body;
    const whereClause = { sellerId };

    if (q) {
      // relation filter ผ่าน Post
      whereClause.Post = {
        is: {
          Property_Name: { contains: q, mode: "insensitive" },
        },
      };
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
      whereClause.startTime = { gte: startDate, lt: endDate };
    }

    if (isBooked !== undefined && isBooked !== null) {
      whereClause.isBooked =
        isBooked === true || String(isBooked).toLowerCase() === "true";
    }

    const dateTimeSlots = await prisma.dateTimeSlot.findMany({
      where: whereClause,
      include: { Post: true },
      orderBy: { startTime: "asc" },
    });
    res.status(200).json({ message: "Success", data: dateTimeSlots });
  } catch (err) {
    console.error("Error in searchFilterDateTimeSlot:", err);
    res
      .status(500)
      .json({ success: false, message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};

/*
GET /api/user → ดูผู้ใช้ทั้งหมด
GET /api/user/:id → ดูผู้ใช้ตาม ID
PUT /api/user/:id → แก้ไขข้อมูลผู้ใช้ทั่วไป (First_name, Last_name, Phone ฯลฯ)
DELETE /api/user/:id → ลบผู้ใช้ (พร้อมลบ Buyer/Seller ที่เกี่ยวข้อง)
*/
