const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  Parking_Needs: ParkingNeedsEnum,
  Nearby_Facilities: NearbyFacilitiesEnum,
  Lifestyle_Preferences: LifestylePreferencesEnum,
} = require("@prisma/client");
const { sendResetEmail, verifyemail } = require("../utils/email");

// ----- helper: ดึง userId ให้ชัวร์ -----
const getSessionUserId = (req) => {
  const u = req.session?.user;
  return u?.userId ?? u?.id ?? null; // รองรับทั้ง userId และ id
};

// ===== preRegister =====
const preRegister = async (req, res) => {
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
    const link = `http://localhost:5173/verifyemail?token=${encodedToken}`;

    verifyemail(Email, link);
    return res.json({ message: "Verification email sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===== verify and register (Buyer) =====
const verifyandregister = async (req, res) => {
  try {
    const {
      token: encodedToken,
      DateofBirth,
      Occupation,
      Monthly_Income,
      Family_Size,
      Preferred_Province,
      Preferred_District,
      National_ID,
      Company_Name,
      RealEstate_License,
      Status,
      Parking_Needs,
      Nearby_Facilities,
      Lifestyle_Preferences,
      Special_Requirements,
    } = req.body;

    const originalToken = Buffer.from(encodedToken, "base64").toString(
      "ascii"
    );
    const decoded = jwt.verify(originalToken, process.env.SECRETKEY);
    const { Email, Password, Phone, First_name, Last_name } = decoded;

    // ถ้าฟิลด์พวกนี้ optional ให้เช็คก่อนค่อย validate
    if (Parking_Needs && !Object.values(ParkingNeedsEnum).includes(Parking_Needs))
      return res.status(400).json({ message: "Invalid Parking_Needs value" });
    if (Nearby_Facilities && !Object.values(NearbyFacilitiesEnum).includes(Nearby_Facilities))
      return res.status(400).json({ message: "Invalid Nearby_Facilities value" });
    if (Lifestyle_Preferences && !Object.values(LifestylePreferencesEnum).includes(Lifestyle_Preferences))
      return res
        .status(400)
        .json({ message: "Invalid Lifestyle_Preferences value" });

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
            DateofBirth: DateofBirth ? new Date(DateofBirth) : null,
            Occupation,
            Monthly_Income: Monthly_Income ? Number(Monthly_Income) : null,
            Family_Size: Family_Size ? Number(Family_Size) : null,
            Preferred_Province,
            Preferred_District,
            Parking_Needs,
            Nearby_Facilities,
            Lifestyle_Preferences,
            Special_Requirements,
          },
        },
      },
    });

    return res.send("Register success");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ===== login =====
const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await prisma.user.findFirst({
      where: { Email },
      include: { Seller: true, Buyer: true },
    });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    const is_Match = await bcrypt.compare(Password, user.Password);
    if (!is_Match) {
      return res.status(400).json({ message: "Password invalid" });
    }

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
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ===== forgot password =====
const forgotPassword = async (req, res) => {
  try {
    const { Email } = req.body;
    if (!Email) return res.status(400).json({ message: "Email is required" });

    const user = await prisma.user.findFirst({ where: { Email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign(
      { userId: user.id, email: user.Email },
      process.env.SECRETKEY,
      { expiresIn: "1h" }
    );

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    const resetLink = `http://localhost:5173/resetpassword?token=${token}`;
    await sendResetEmail(Email, resetLink);

    return res.json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ===== reset password =====
const resetPassword = async (req, res) => {
  const { token, Password } = req.body;

  const tokenEntry = await prisma.passwordResetToken.findFirst({
    where: { token },
  });
  if (!tokenEntry) {
    return res.status(400).json({ message: "Token invalid" });
  }
  if (tokenEntry.expiresAt < new Date()) {
    return res.status(400).json({ message: "Token expired" });
  }

  const hashed = await bcrypt.hash(Password, 10);

  await prisma.user.update({
    where: { id: tokenEntry.userId },
    data: { Password: hashed },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return res.json({ message: "Password updated" });
};

// ===== get profile =====
const getProfile = async (req, res) => {
  try {
    const id = req.session?.user?.userId ?? req.session?.user?.id ?? null;
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
            Booking: true
          }
        },
        Buyer: {
          select: {
            DateofBirth: true,
            Occupation: true,
            Monthly_Income: true,
            Family_Size: true,
            Preferred_District: true,
            Parking_Needs: true,
            Nearby_Facilities: true,
            Lifestyle_Preferences: true,
            Booking: true
          }
        },
        Deposit: {
          select: {
            id: true,
            Deposit_Status: true,
            Deposit_Amount: true,
            Post: {
              select: {
                Property_Name: true
              }
            }
          }
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
            sellerId:true
          }
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

    // ✅ Sync session ให้ตรงกับ DB เสมอ (สำคัญสำหรับการสร้างโพสต์ให้ผ่าน 403)
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
    console.error("Error in getProfile:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ===== logout =====
const logout = (req, res) => {
  console.log("Logout route called");
  console.log("Session before destroy:", req.session);
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

// ===== register seller =====
// ...เดิมข้างบนคงไว้
const registerSeller = async (req, res) => {
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
          nationalIdImage: req.file.path,
          publicId: req.file.filename,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { userType: "Seller" },
      });

      return newSeller;
    });
    req.session.user.userType = "Seller";
    req.session.user.sellerId = result.id; 

    // ✅ อัปเดต session ให้กลายเป็น Seller ทันที
    req.session.user = {
      ...(req.session.user || {}),
      userId,
      userType: "Seller",
      sellerId: result.id,
    };
    req.session.save((err) => {
      if (err) {
        console.error("Session save error after registerSeller:", err);
        // ไม่ fail งานหลัก แค่ log
      }
    });

    return res.status(201).json({
      message:
        "Seller registration successful! Your application is pending review.",
      seller: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message || "Server error" });
  }
};


// ✅ รวม export ให้ router ดึงได้แน่นอน
module.exports = {
  preRegister,
  verifyandregister,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  logout,
  registerSeller,
};
