// controllers/auth.js (ESM, updated for nationalId + regAddress at Buyer signup)

import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  Parking_Needs as ParkingNeedsEnum,
  Nearby_Facilities as NearbyFacilitiesEnum,
  Lifestyle_Preferences as LifestylePreferencesEnum,
} from "@prisma/client";
import { sendResetEmail, verifyemail } from "../utils/email.js";

/* ========== Helpers ========== */
const getSessionUserId = (req) => {
  const u = req.session?.user;
  return u?.userId ?? u?.id ?? null;
};

const FRONTEND_URL =
  process.env.FRONTEND_URL?.replace(/\/+$/, "") || "http://localhost:5173";

// ตรวจเลขบัตร ปชช. 13 หลัก + checksum (inline, ไม่ต้องแยกไฟล์)
const isThaiNationalIdValid = (id) => {
  const s = String(id || "").replace(/\D/g, "");
  if (!/^\d{13}$/.test(s)) return false;
  const d = s.split("").map(Number);
  const sum = d.slice(0, 12).reduce((acc, x, i) => acc + x * (13 - i), 0);
  const check = (11 - (sum % 11)) % 10;
  return check === d[12];
};
const maskThaiId = (s = "") =>
  s && s.length === 13
    ? `${s[0]}-${s.slice(1, 5)}-${s.slice(5, 10)}-${s.slice(10, 12)}-${s[12]}`
    : s;

/* ========== preRegister (ส่งลิงก์ยืนยัน) ========== */
/**
 * ฝั่ง frontend จะโพสต์มาพร้อม:
 * {
 *   First_name, Last_name, Email, Phone, Password,
 *   nationalId,
 *   regAddress: { houseNo, village, alley, road, subdistrict, district, province }
 * }
 */
export const preRegister = async (req, res) => {
  try {
    const {
      Email,
      Password,
      Phone,
      First_name,
      Last_name,
      nationalId,
      regAddress,
    } = req.body;

    if (!Email) return res.status(400).json({ message: "ไม่พบอีเมล" });
    if (!Password)
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });

    // ✅ บังคับข้อมูลบัตร + ที่อยู่ทะเบียนบ้าน ให้ครบตั้งแต่ขั้นนี้
    if (!nationalId) {
      return res.status(400).json({ message: "กรุณากรอกเลขบัตรประชาชน" });
    }
    if (!isThaiNationalIdValid(nationalId)) {
      return res.status(400).json({ message: "เลขบัตรประชาชนไม่ถูกต้อง" });
    }
    if (
      !regAddress ||
      !regAddress.houseNo ||
      !regAddress.village ||
      !regAddress.alley ||
      !regAddress.road ||
      !regAddress.subdistrict ||
      !regAddress.district ||
      !regAddress.province
    ) {
      return res
        .status(400)
        .json({ message: "กรุณากรอกที่อยู่ตามทะเบียนบ้านให้ครบ" });
    }

    // กัน email ซ้ำ
    const existingUser = await prisma.user.findFirst({ where: { Email } });
    if (existingUser) {
      return res.status(400).json({ message: "คุณมีอีเมลนี้อยู่แล้ว" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    // ฝังข้อมูลจำเป็นทั้งหมดลง token (อายุ 10 นาที)
    const token = jwt.sign(
      {
        Email,
        Password: hashedPassword,
        Phone,
        First_name,
        Last_name,
        userType: "Buyer",
        nationalId: String(nationalId).replace(/\D/g, ""),
        regAddress, // {houseNo,...,province}
      },
      process.env.SECRETKEY,
      { expiresIn: "10m" }
    );

    const encodedToken = Buffer.from(token).toString("base64");
    const link = `${FRONTEND_URL}/verifyemail?token=${encodedToken}`;
    console.log("preRegister token(base64):", encodedToken);
    await verifyemail(Email, link);
    return res.json({ message: "ยืนยันอีเมล ได้ถูกส่งไปแล้ว" });
  } catch (err) {
    console.error("preRegister error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ========== verify & register (Buyer) ========== */
/**
 * Frontend จะเรียกมาพร้อม:
 * {
 *   token: "<base64-jwt>",
 *   // ด้านล่างเป็น optional (ค่า preference/ข้อมูลเพิ่มของ Buyer)
 *   DateofBirth, Occupation, Monthly_Income, Family_Size,
 *   Preferred_Province, Preferred_District, Preferred_Subdistrict,
 *   Parking_Needs, Nearby_Facilities, Lifestyle_Preferences, Special_Requirements
 * }
 * เราจะอ่าน Email/Password/Phone/First_name/Last_name + nationalId + regAddress จาก token
 * แล้วรวมกับค่า prefs ใน body เพื่อสร้าง User + Buyer
 */
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
      Preferred_Subdistrict,
      Parking_Needs,
      Nearby_Facilities,
      Lifestyle_Preferences,
      Special_Requirements,
    } = req.body;

    if (!encodedToken)
      return res.status(400).json({ message: "Missing verification token" });

    // ถ้าต้องการบังคับ prefs ขั้นต่ำ (ตามของเดิม)
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

    const {
      Email,
      Password, // hashed from preRegister
      Phone,
      First_name,
      Last_name,
      nationalId,
      regAddress,
    } = decoded;

    // ป้องกันสมัครซ้ำ
    const dup = await prisma.user.findFirst({ where: { Email } });
    if (dup) return res.status(400).json({ message: "Email already exists" });

    // validate enums (optional)
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

    // ✅ สร้าง User + Buyer พร้อมเลขบัตรและที่อยู่ทะเบียนบ้าน
    await prisma.user.create({
      data: {
        Email,
        Password,
        Phone,
        First_name,
        Last_name,
        userType: "Buyer",
        Buyer: {
          create: {
            // บังคับจาก token:
            National_ID: nationalId,
            Reg_HouseNo: regAddress?.houseNo ?? null,
            Reg_Village: regAddress?.village ?? null,
            Reg_Alley: regAddress?.alley ?? null,
            Reg_Road: regAddress?.road ?? null,
            Reg_Subdistrict: regAddress?.subdistrict ?? null,
            Reg_District: regAddress?.district ?? null,
            Reg_Province: regAddress?.province ?? null,

            // prefs จาก body:
            DateofBirth: DateofBirth ? new Date(DateofBirth) : null,
            Occupation: Occupation || null,
            Monthly_Income: Number(Monthly_Income),
            Family_Size: Number(Family_Size),
            Preferred_Province,
            Preferred_District,
            Preferred_Subdistrict: Preferred_Subdistrict || null,
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
    if (err?.code === "P2002") {
      // unique constraint (เช่น National_ID ซ้ำ)
      return res.status(400).json({ message: "เลขบัตรนี้ถูกใช้งานแล้ว" });
    }
    console.error("verifyandregister error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* ========== login ========== */
export const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await prisma.user.findFirst({
      where: { Email },
      include: { Seller: true, Buyer: true },
    });
    if (!user) return res.status(400).json({ message: "ยังไม่มีบัญชีนี้" });

    const is_Match = await bcrypt.compare(Password, user.Password);
    if (!is_Match)
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });

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

/* ========== forgot password ========== */
export const forgotPassword = async (req, res) => {
  try {
    const { Email } = req.body;
    if (!Email)
      return res.status(400).json({ message: "ไม่เจออีเมลดังกล่าวในระบบ" });

    const user = await prisma.user.findFirst({ where: { Email } });
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });

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

    return res.json({
      message: "ลิงค์รีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลของคุณแล้ว",
    });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* ========== reset password ========== */
export const resetPassword = async (req, res) => {
  try {
    const { token, Password } = req.body;
    if (!token || !Password)
      return res.status(400).json({ message: "ไม่มีโทเค็นหรือรหัสผ่าน" });

    const tokenEntry = await prisma.passwordResetToken.findFirst({
      where: { token },
    });
    if (!tokenEntry) return res.status(400).json({ message: "Token invalid" });
    if (tokenEntry.expiresAt < new Date())
      return res.status(400).json({ message: "Token expired" });

    const hashed = await bcrypt.hash(Password, 10);
    await prisma.user.update({
      where: { id: tokenEntry.userId },
      data: { Password: hashed },
    });

    await prisma.passwordResetToken.deleteMany({ where: { token } });

    return res.json({ message: "รหัสผ่าน ถูกเปลี่ยนแล้ว" });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* ========== getProfile ========== */
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
            // ❌ ตัด National_ID ออก (อยู่ที่ Buyer แล้ว)
            Company_Name: true,
            RealEstate_License: true,
            Status: true,
            nationalIdImage: true,
            DateTimeSlot: {
              select: {
                id: true,
                startTime: true,
                endTime: true,
                isBooked: true,
                Post: { select: { id: true, Property_Name: true } },
              },
            },
            Booking: {
              select: {
                id: true,
                bookingStatus: true,
                propertyUnitId: true,
                propertyUnit: {
                  select: {
                    propertyPost: { select: { id: true, Property_Name: true } },
                  },
                },
                dateTimeSlot: { select: { startTime: true, endTime: true } },
                Seller: {
                  select: {
                    user: { select: { First_name: true, Last_name: true } },
                  },
                },
              },
            },
          },
        },
        Payment: { select: { Payment_Slip: true, postId: true, unitId: true } },
        Buyer: {
          select: {
            id: true,
            // ✅ แสดงเลขบัตร + ที่อยู่ทะเบียนบ้าน (ฝั่ง UI ควร mask)
            National_ID: true,
            Reg_HouseNo: true,
            Reg_Village: true,
            Reg_Alley: true,
            Reg_Road: true,
            Reg_Subdistrict: true,
            Reg_District: true,
            Reg_Province: true,

            DateofBirth: true,
            Occupation: true,
            Monthly_Income: true,
            Family_Size: true,
            Preferred_Province: true,
            Preferred_District: true,
            Preferred_Subdistrict: true,
            Parking_Needs: true,
            Nearby_Facilities: true,
            Lifestyle_Preferences: true,
            Special_Requirements: true,

            Booking: {
              select: {
                id: true,
                bookingStatus: true,
                propertyUnitId: true,
                propertyUnit: {
                  select: {
                    propertyPost: { select: { id: true, Property_Name: true } },
                  },
                },
                dateTimeSlot: { select: { startTime: true, endTime: true } },
                Seller: {
                  select: {
                    user: { select: { First_name: true, Last_name: true } },
                  },
                },
              },
            },
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
            PropertyUnit: {
              select: {
                id: true,
                Unit_Number: true,
                Booking: {
                  select: {
                    id: true,
                    bookingStatus: true,
                    finalSlipUrl: true,
                    Buyer: {
                      select: {
                        user: {
                          select: {
                            id: true,
                            First_name: true,
                            Last_name: true,
                          },
                        },
                      },
                    },
                  },
                },
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
                postId: true,
                unitId: true,
                User: {
                  select: { id: true, First_name: true, Last_name: true },
                },
                Post: { select: { Property_Name: true } },
                unit: {
                  select: {
                    Unit_Number: true,
                    Deposit: { select: { Deposit_Status: true } },
                    Booking: {
                      select: {
                        id: true,
                        bookingStatus: true,
                        finalSlipUrl: true,
                      },
                    },
                  },
                },
              },
            },
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
            postId: true,
            unitId: true,
            User: { select: { id: true, First_name: true, Last_name: true } },
            Post: { select: { Property_Name: true } },
            unit: {
              select: {
                Unit_Number: true,
                Deposit: { select: { Deposit_Status: true } },
                Booking: {
                  select: {
                    id: true,
                    bookingStatus: true,
                    finalSlipUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.Password) delete user.Password;

    // ปรับเลขบัตรให้ mask ก่อนส่ง (กันหลุด plain)
    if (user.Buyer?.National_ID) {
      user.Buyer.National_ID = maskThaiId(user.Buyer.National_ID);
    }

    // Sync session
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

    return res.status(200).json({ user });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* ========== logout ========== */
export const logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res
          .status(500)
          .json({ message: "Could not log out, please try again." });
      }
      res.clearCookie("connect.sid", { path: "/" });
      return res.status(200).json({ message: "Logout successful" });
    });
  } catch (err) {
    console.log("Catch error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* ========== registerSeller (อัปเกรดเป็นผู้ขาย) ========== */
/**
 * เปลี่ยนแปลงสำคัญ:
 * - ❌ ไม่รับ National_ID จาก body แล้ว
 * - ✅ ไม่บังคับแนบไฟล์ (ถ้ามีก็เก็บ, ถ้าไม่มีไม่เป็นไร)
 * - ✅ เช็กว่า user มี Buyer และ Buyer.National_ID อยู่ก่อน (สมัครเป็นผู้ซื้อแล้วเท่านั้น)
 */
export const registerSeller = async (req, res) => {
  try {
    const userId = getSessionUserId(req);
    if (!userId) {
      return res
        .status(401)
        .json({ message: "ไม่ได้รับอนุญาต กรุณาเข้าสู่ระบบ" });
    }

    // ต้องเป็น Buyer ที่มีเลขบัตรแล้ว
    const buyer = await prisma.buyer.findUnique({ where: { userId } });
    if (!buyer || !buyer.National_ID) {
      return res
        .status(400)
        .json({ message: "กรุณาสมัครเป็นผู้ซื้อและยืนยันเลขบัตรก่อน" });
    }

    const { Company_Name, RealEstate_License, StartTime } = req.body;
    const file = req.file; // แนบมาก็เก็บ ไม่แนบก็ผ่าน

    const result = await prisma.$transaction(async (tx) => {
      // ผู้ใช้ซ้ำ?
      const existed = await tx.seller.findUnique({ where: { userId } });
      if (existed) throw new Error("ผู้ขายได้ลงทะเบียนแล้ว");

      const newSeller = await tx.seller.create({
        data: {
          userId,
          Company_Name: Company_Name || null,
          RealEstate_License: RealEstate_License || null,
          Status: "PENDING",
          nationalIdImage: file?.path || null,
          publicId: file?.filename || null,
          StartTime: StartTime ? new Date(StartTime) : null,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { userType: "Seller" },
      });

      return newSeller;
    });

    // sync session
    req.session.user = {
      ...(req.session.user || {}),
      userId,
      userType: "Seller",
      sellerId: result.id,
    };
    req.session.save?.();

    return res.status(201).json({
      message: "การลงทะเบียนผู้ขายสำเร็จ! ใบสมัครของคุณอยู่ระหว่างการพิจารณา",
      seller: result,
    });
  } catch (err) {
    console.error("registerSeller error:", err);
    return res.status(400).json({ message: err.message || "Server error" });
  }
};
