// controllers/auth.js  (ESM version)

import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  Parking_Needs as ParkingNeedsEnum,
  Nearby_Facilities as NearbyFacilitiesEnum,
  Lifestyle_Preferences as LifestylePreferencesEnum,
} from "@prisma/client";
import { sendResetEmail, verifyemail } from "../utils/email.js";

// ---------- Helpers ----------
const getSessionUserId = (req) => {
  const u = req.session?.user;
  return u?.userId ?? u?.id ?? null; // รองรับทั้ง userId และ id
};

const FRONTEND_URL =
  process.env.FRONTEND_URL?.replace(/\/+$/, "") || "http://localhost:5173";

// ---------- preRegister ----------
export const preRegister = async (req, res) => {
  try {
    const { Email, Password, Phone, First_name, Last_name } = req.body;

    if (!Email) return res.status(400).json({ message: "Email is required!!" });
    if (!Password)
      return res.status(400).json({ message: "Password is required!!" });

    const existingUser = await prisma.user.findFirst({ where: { Email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const token = jwt.sign(
      {
        Email,
        Password: hashedPassword,
        Phone,
        First_name,
        Last_name,
        userType: "Buyer",
      },
      process.env.SECRETKEY,
      { expiresIn: "10m" }
    );

    const encodedToken = Buffer.from(token).toString("base64");
    const link = `${FRONTEND_URL}/verifyemail?token=${encodedToken}`;

    await verifyemail(Email, link);
    return res.json({ message: "Verification email sent" });
  } catch (err) {
    console.error("preRegister error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------- verify & register (Buyer) ----------
export const verifyandregister = async (req, res) => {
  try {
    const {
      token: encodedToken,
      DateofBirth,
      Occupation,
      Monthly_Income,
      Family_Size,
      Preferred_Province,
      Preferred_District,
      National_ID, // reserved for future Seller path
      Company_Name, // reserved
      RealEstate_License, // reserved
      Status, // reserved
      Parking_Needs,
      Nearby_Facilities,
      Lifestyle_Preferences,
      Special_Requirements,
    } = req.body;

    if (!encodedToken)
      return res.status(400).json({ message: "Missing verification token" });

    // ✅ Validate required fields for Buyer (ตาม schema.prisma)
    if (
      Monthly_Income == null ||
      Family_Size == null ||
      !Preferred_Province ||
      !Preferred_District
    ) {
      return res.status(400).json({
        message:
          "Missing required Buyer fields: Monthly_Income, Family_Size, Preferred_Province, Preferred_District",
      });
    }

    const originalToken = Buffer.from(encodedToken, "base64").toString("ascii");
    const decoded = jwt.verify(originalToken, process.env.SECRETKEY);
    const { Email, Password, Phone, First_name, Last_name } = decoded;

    // Validate enums only if provided (เพื่อให้สอดคล้องกับฟอร์มที่ optional)
    if (
      Parking_Needs &&
      !Object.values(ParkingNeedsEnum).includes(Parking_Needs)
    ) {
      return res.status(400).json({ message: "Invalid Parking_Needs value" });
    }
    if (
      Nearby_Facilities &&
      !Object.values(NearbyFacilitiesEnum).includes(Nearby_Facilities)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid Nearby_Facilities value" });
    }
    if (
      Lifestyle_Preferences &&
      !Object.values(LifestylePreferencesEnum).includes(Lifestyle_Preferences)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid Lifestyle_Preferences value" });
    }

    // ป้องกันเคสกดลิงก์ซ้ำ
    const dup = await prisma.user.findFirst({ where: { Email } });
    if (dup) return res.status(400).json({ message: "Email already exists" });

    await prisma.user.create({
      data: {
        Email,
        Password, // already hashed in preRegister
        Phone,
        First_name,
        Last_name,
        userType: "Buyer",
        Buyer: {
          create: {
            DateofBirth: DateofBirth ? new Date(DateofBirth) : null,
            Occupation: Occupation || null,
            Monthly_Income: Number(Monthly_Income), // ✅ required
            Family_Size: Number(Family_Size),       // ✅ required
            Preferred_Province,                     // ✅ required
            Preferred_District,                     // ✅ required
            Parking_Needs: Parking_Needs || null,
            Nearby_Facilities: Nearby_Facilities || null,
            Lifestyle_Preferences: Lifestyle_Preferences || null,
            Special_Requirements: Special_Requirements || null,
          },
        },
      },
    });

    return res.send("Register success");
  } catch (err) {
    console.error("verifyandregister error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ---------- login ----------
export const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await prisma.user.findFirst({
      where: { Email },
      include: { Seller: true, Buyer: true },
    });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const is_Match = await bcrypt.compare(Password, user.Password);
    if (!is_Match)
      return res.status(400).json({ message: "Password invalid" });

    const payload = {
      userId: user.id,
      Email: user.Email,
      userType: user.userType,
      Phone: user.Phone,
      First_name: user.First_name,
      Last_name: user.Last_name,
      image: user.image,
    };
    if (user.Buyer) {
      payload.buyerId = user.Buyer.id;
      payload.Buyer = user.Buyer;
    }
    if (user.userType === "Seller" && user.Seller) {
      payload.sellerId = user.Seller.id;
      payload.Seller = user.Seller;
    }

    req.session.user = payload;
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res
          .status(500)
          .json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
      }
      console.log(
        "Login successful, session created for user:",
        req.session.user.userId
      );
      return res.status(200).json({
        message: "Login Success",
        user: req.session.user,
      });
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ---------- forgot password ----------
export const forgotPassword = async (req, res) => {
  try {
    const { Email } = req.body;
    if (!Email) return res.status(400).json({ message: "Email is required" });

    const user = await prisma.user.findFirst({ where: { Email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ให้ JWT และ DB token หมดอายุสอดคล้องกัน = 10 นาที
    const token = jwt.sign(
      { userId: user.id, email: user.Email },
      process.env.SECRETKEY,
      { expiresIn: "10m" }
    );

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    const resetLink = `${FRONTEND_URL}/resetpassword?token=${token}`;
    await sendResetEmail(Email, resetLink);

    return res.json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ---------- reset password ----------
export const resetPassword = async (req, res) => {
  try {
    const { token, Password } = req.body;
    if (!token || !Password)
      return res.status(400).json({ message: "Missing token or password" });

    const tokenEntry = await prisma.passwordResetToken.findFirst({
      where: { token },
    });
    if (!tokenEntry)
      return res.status(400).json({ message: "Token invalid" });
    if (tokenEntry.expiresAt < new Date())
      return res.status(400).json({ message: "Token expired" });

    const hashed = await bcrypt.hash(Password, 10);
    await prisma.user.update({
      where: { id: tokenEntry.userId },
      data: { Password: hashed },
    });

    // หาก schema ไม่ได้ unique ที่ field token ให้ใช้ deleteMany แทน
    await prisma.passwordResetToken.deleteMany({ where: { token } });

    return res.json({ message: "Password updated" });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ---------- getProfile ----------
export const getProfile = async (req, res) => {
  try {
    const id = getSessionUserId(req);
    if (!id) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        Seller: {
          select: {
            id: true,
            National_ID: true,
            Company_Name: true,
            RealEstate_License: true,
            Status: true,
            nationalIdImage: true,
            DateTimeSlot: true,
            Booking: true,
          },
        },
        Buyer: {
          select: {
            DateofBirth: true,
            Occupation: true,
            Monthly_Income: true,
            Family_Size: true,
            Preferred_Province: true,   // ✅ เพิ่มให้ครบ
            Preferred_District: true,
            Parking_Needs: true,
            Nearby_Facilities: true,
            Lifestyle_Preferences: true,
            Booking: true,
          },
        },
        Deposit: {
          select: {
            id: true,
            Deposit_Status: true,
            Deposit_Amount: true,
            Post: { select: { Property_Name: true } },
          },
        },
        Notification: true,
        PropertyPost: {
          select: {
            id: true,
            Property_Name: true,
            Price: true,
            Province: true,
            Subdistrict: true,
            District: true,
            Address: true,
            Deposit_Amount: true,
            Sell_Rent: true,
            Image: true,
            Deposit: true,
            sellerId: true,
          },
        },
        DocumentUpload: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            DocumentName: true,
            Review_Status: true,
            DocumentUrl: true,
            createdAt: true,
            User: { select: { First_name: true, Last_name: true } },
          },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.Password) delete user.Password;

    // Sync session กับข้อมูลล่าสุดจาก DB (กัน 403 ตอนสร้างโพสต์/สิทธิ์)
    req.session.user = {
      userId: user.id,
      Email: user.Email,
      userType: user.userType,
      Phone: user.Phone,
      First_name: user.First_name,
      Last_name: user.Last_name,
      image: user.image,
      ...(user.Buyer ? { buyerId: user.Buyer.id, Buyer: user.Buyer } : {}),
      ...(user.Seller ? { sellerId: user.Seller.id, Seller: user.Seller } : {}),
    };
    req.session.save((err) => {
      if (err) console.error("Session re-save error in getProfile:", err);
    });

    console.log("Successfully fetched profile for user:", user.id);
    return res.status(200).json({ user });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ---------- logout ----------
export const logout = (req, res) => {
  console.log("Logout route called");
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res
          .status(500)
          .json({ message: "Could not log out, please try again." });
      }
      console.log("Session destroyed");
      res.clearCookie("connect.sid", { path: "/" });
      return res.status(200).json({ message: "Logout successful" });
    });
  } catch (err) {
    console.log("Catch error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ---------- registerSeller ----------
export const registerSeller = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "กรุณาแนบรูปภาพบัตรประชาชน" });
    }

    const userId = getSessionUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { National_ID, Company_Name, RealEstate_License } = req.body;
    if (!National_ID) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลบัตรประชาชน" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingSeller = await tx.seller.findFirst({
        where: {
          OR: [{ National_ID }, { RealEstate_License }, { userId }],
        },
      });
      if (existingSeller) {
        if (existingSeller.userId === userId)
          throw new Error("This user is already registered as a seller.");
        if (existingSeller.National_ID === National_ID)
          throw new Error("This National ID is already registered.");
        throw new Error("This Real Estate License is already registered.");
      }

      const newSeller = await tx.seller.create({
        data: {
          userId,
          National_ID,
          Company_Name,
          RealEstate_License,
          Status: "PENDING",
          nationalIdImage: req.file.path, // Cloudinary URL
          publicId: req.file.filename, // Cloudinary public ID
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { userType: "Seller" },
      });

      return newSeller;
    });

    // Update session -> เป็น Seller ทันที
    req.session.user = {
      ...(req.session.user || {}),
      userId,
      userType: "Seller",
      sellerId: result.id,
    };
    req.session.save((err) => {
      if (err)
        console.error("Session save error after registerSeller:", err);
    });

    return res.status(201).json({
      message:
        "Seller registration successful! Your application is pending review.",
      seller: result,
    });
  } catch (err) {
    console.error("registerSeller error:", err);
    return res.status(400).json({ message: err.message || "Server error" });
  }
};
