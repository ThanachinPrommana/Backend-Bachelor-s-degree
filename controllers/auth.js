const prisma = require("../config/prisma")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Parking_Needs: ParkingNeedsEnum, Nearby_Facilities: NearbyFacilitiesEnum, Lifestyle_Preferences: LifestylePreferencesEnum, Parking_Needs, Nearby_Facilities, Lifestyle_Preferences } = require("@prisma/client")
const { sendResetEmail, verifyemail } = require("../utils/email")
exports.preRegister = async (req, res) => {
  try {
    const {
      Email,
      Password,
      Phone,
      First_name,
      Last_name,
    } = req.body;

    if (!Email) return res.status(400).json({ message: "Email is required!!" });
    if (!Password) return res.status(400).json({ message: "Password is required!!" });

    const existingUser = await prisma.user.findFirst({
      where: {
        Email: Email
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const token = jwt.sign({
      Email: Email, Password: hashedPassword, Phone, First_name, Last_name, userType: "Buyer"
    }, process.env.SECRETKEY, { expiresIn: "10m" })

    const encodedToken = Buffer.from(token).toString('base64');
    console.log("Test Token:", "+", encodedToken, "+")
    const link = `http://localhost:5173/verifyemail?token=${encodedToken}`

    verifyemail(Email, link)
    // Register Buyer


    res.json({ message: "Verification email sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.verifyandregister = async (req, res) => {
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
      Special_Requirements
    } = req.body
    const originalToken = Buffer.from(encodedToken, 'base64').toString('ascii');
    const decoded = jwt.verify(originalToken, process.env.SECRETKEY)
    const {
      Email,
      Password,
      Phone,
      First_name,
      Last_name,
      userType,
    } = decoded

    if (!Object.values(ParkingNeedsEnum).includes(Parking_Needs)) {
      return res.status(400).json({ message: "Invalid Parking_Needs value" });
    }
    if (!Object.values(NearbyFacilitiesEnum).includes(Nearby_Facilities)) {
      return res.status(400).json({ message: "Invalid Nearby_Facilities value" });
    }
    if (!Object.values(LifestylePreferencesEnum).includes(Lifestyle_Preferences)) {
      return res.status(400).json({ message: "Invalid Lifestyle_Preferences value" });
    }
    await prisma.user.create({
      data: {
        Email: Email,
        Password: Password,
        Phone: Phone,
        First_name: First_name,
        Last_name: Last_name,
        userType: "Buyer",
        Buyer: {
          create: {
            DateofBirth: DateofBirth ? new Date(DateofBirth) : null,
            Occupation: Occupation,
            Monthly_Income: Monthly_Income ? Number(Monthly_Income) : null,
            Family_Size: Family_Size ? Number(Family_Size) : null,
            Preferred_Province: Preferred_Province,
            Preferred_District: Preferred_District,
            Parking_Needs: Parking_Needs,
            Nearby_Facilities: Nearby_Facilities,
            Lifestyle_Preferences: Lifestyle_Preferences,
            Special_Requirements: Special_Requirements
          }
        }
      }
    });
    // if (userType === "Buyer") {

    //   if (!Object.values(ParkingNeedsEnum).includes(Parking_Needs)) {
    //     return res.status(400).json({ message: "Invalid Parking_Needs value" });
    //   }

    //   if (!Object.values(NearbyFacilitiesEnum).includes(Nearby_Facilities)) {
    //     return res.status(400).json({ message: "Invalid Nearby_Facilities value" });
    //   }

    //   if (!Object.values(LifestylePreferencesEnum).includes(Lifestyle_Preferences)) {
    //     return res.status(400).json({ message: "Invalid Lifestyle_Preferences value" });
    //   }

    //   await prisma.user.create({
    //     data: {
    //       Email: Email,
    //       Password: Password,
    //       Phone: Phone,
    //       First_name: First_name,
    //       Last_name: Last_name,
    //       userType: "Buyer",
    //       Buyer: {
    //         create: {
    //           DateofBirth: DateofBirth ? new Date(DateofBirth) : null,
    //           Occupation: Occupation,
    //           Monthly_Income: Monthly_Income ? Number(Monthly_Income) : null,
    //           Family_Size: Family_Size ? Number(Family_Size) : null,
    //           Preferred_Province: Preferred_Province,
    //           Preferred_District: Preferred_District,
    //           Parking_Needs: Parking_Needs,
    //           Nearby_Facilities: Nearby_Facilities,
    //           Lifestyle_Preferences: Lifestyle_Preferences,
    //           Special_Requirements: Special_Requirements
    //         }
    //       }
    //     }
    //   });

    //   return res.json({ message: "Register Buyer success" });
    // }

    // // Register Seller
    // if (userType === "Seller") {
    //   await prisma.user.create({
    //     data: {
    //       Email: Email,
    //       Password: Password,
    //       Phone: Phone,
    //       First_name: First_name,
    //       Last_name: Last_name,
    //       userType: "Seller",
    //       Seller: {
    //         create: {
    //           National_ID: National_ID,
    //           Company_Name: Company_Name,
    //           RealEstate_License: RealEstate_License,
    //           Status: Status,
    //           StartTime: new Date(),
    //         }
    //       }
    //     }
    //   });

    return res.send("Register sucess")
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Server Error"
    })
  }
}

// ใน controllers/authController.js
exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await prisma.user.findFirst({
      where: { Email: Email },
      include: {
        Seller: true,
        Buyer: true,
      }
    });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    const is_Match = await bcrypt.compare(Password, user.Password);
    if (!is_Match) {
      return res.status(400).json({ message: "Password invalid" });
    }

    // --- สร้าง Payload ที่สมบูรณ์ ---
    // 1. สร้างข้อมูลพื้นฐานของ User
    let payload = {
      userId: user.id, // ID หลักของ User, เปลี่ยนชื่อจาก id เพื่อความชัดเจน
      Email: user.Email,
      userType: user.userType,
      Phone: user.Phone,
      First_name: user.First_name,
      Last_name: user.Last_name,
      image: user.image
    };

    // 2. เพิ่มข้อมูล Buyer (User ทุกคนควรจะมี)
    if (user.Buyer) {
      payload.buyerId = user.Buyer.id; // 🔥 ID ของ Buyer สำหรับ Backend
      payload.Buyer = user.Buyer;      // Object เต็มๆ สำหรับ Frontend
    }

    // 3. ถ้าเป็น Seller ให้เพิ่มข้อมูล Seller ด้วย
    if (user.userType === "Seller" && user.Seller) {
      payload.sellerId = user.Seller.id; // 🔥 ID ของ Seller สำหรับ Backend
      payload.Seller = user.Seller;      // Object เต็มๆ สำหรับ Frontend
    }

    // 4. บันทึก Payload ที่สมบูรณ์ลงใน session
    req.session.user = payload;

    req.session.save(err => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
      }
      console.log("Login successful, session created for user:", req.session.user.userId);
      res.status(200).json({
        message: "Login Sucess",
        user: req.session.user
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { Email } = req.body;
    const user = await prisma.user.findFirst({ where: { Email: Email } });
    if (!Email) {
      return res.status(400).json({
        message: "Email is required"
      })
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({
      userId: user.id, email: user.Email
    }, process.env.SECRETKEY, { expiresIn: "1h" })

    await prisma.passwordResetToken.create({
      data: {
        token: token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      }
    });
    console.log("+" + token + "+")


    const resetLink = `http://localhost:5173/resetpassword?token=${token}`;
    await sendResetEmail(Email, resetLink);

    res.json({ message: 'Reset link sent to your email.' });

  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Server Error"
    })
  }
}


// ตั้งรหัสผ่านใหม่
exports.resetPassword = async (req, res) => {
  const { token, Password } = req.body;

  const tokenEntry = await prisma.passwordResetToken.findFirst({ where: { token } });

  if (!tokenEntry) {
    return res.status(400).json({ message: 'Token invalid' });
  }
  if (tokenEntry.expiresAt < new Date()) {
    return res.status(400).json({ message: 'Token expired' });
  }

  const hashed = await bcrypt.hash(Password, 10);

  await prisma.user.update({
    where: { id: tokenEntry.userId },
    data: { Password: hashed }
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  res.json({ message: 'Password updated' });
};


exports.getProfile = async (req, res) => {
  try {
    // 🔥 --- ส่วนที่แก้ไข --- 🔥
    // เปลี่ยนจากการดึง id เป็น userId และตั้งชื่อตัวแปรใหม่ว่า id เพื่อให้โค้ดส่วนที่เหลือใช้ได้เหมือนเดิม
    const { userId: id } = req.session.user;

    if (!id) return res.status(401).json({ message: "Unauthorized" });

    // query database ใหม่
    const user = await prisma.user.findUnique({
      where: { id }, // <-- โค้ดส่วนนี้ยังใช้ตัวแปร id ได้เหมือนเดิม
      include: {
        
        Seller: {
          select:{
            id:true,
            National_ID:true,
            Company_Name:true,
            RealEstate_License:true,
            Status:true,
            nationalIdImage:true,
            DateTimeSlot:true,
            Booking:true
          }
        },
        Buyer: {
          select:{
            DateofBirth:true,
            Occupation:true,
            Monthly_Income:true,
            Family_Size:true,
            Preferred_District:true,
            Parking_Needs:true,
            Nearby_Facilities:true,
            Lifestyle_Preferences:true,
            Booking:true
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
            Deposit: true
          }
        },
        DocumentUpload: {
          orderBy: {
            createdAt: "desc"
          },
          select: {
            id: true,
            DocumentName: true,
            Review_Status: true,
            DocumentUrl: true,
            createdAt: true,
            User: {
              select: {
                First_name: true,
                Last_name: true
              }
            }
          }
        }
      }
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.Password) delete user.Password;

    console.log("Successfully fetched profile for user:", user.id);
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.logout = (req, res) => {
  console.log("Logout route called");
  console.log("Session before destroy:", req.session);
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ message: "Could not log out, please try again." });
      }
      console.log("Session destroyed");
      res.clearCookie('connect.sid', { path: '/' });
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (err) {
    console.log("Catch error:", err)
  }
};

exports.registerSeller = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "กรุณาแนบรูปภาพบัตรประชาชน" });
  }

  const userId = req.session.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const { National_ID, Company_Name, RealEstate_License } = req.body;
  if (!National_ID) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลบัตรประชาชน" });
  }

  try {
    // 2. ดึงข้อมูล URL และ publicId จาก req.file ที่ Cloudinary สร้างให้
    const nationalIdImageUrl = req.file.path;
    const nationalIdPublicId = req.file.filename;

    const result = await prisma.$transaction(async (tx) => {
      // ตรวจสอบข้อมูลซ้ำ
      const existingSeller = await tx.seller.findFirst({
        where: {
          OR: [
            { National_ID },
            { RealEstate_License },
            { userId }
          ]
        }
      });
      if (existingSeller) {
        if (existingSeller.userId === userId) throw new Error("This user is already registered as a seller.");
        if (existingSeller.National_ID === National_ID) throw new Error("This National ID is already registered.");
        throw new Error("This Real Estate License is already registered.");
      }

      // 3. สร้าง Seller พร้อมข้อมูลรูปบัตรประชาชน
      const newSeller = await tx.seller.create({
        data: {
          userId: userId,
          National_ID: National_ID,
          Company_Name: Company_Name,
          RealEstate_License: RealEstate_License,
          Status: "PENDING",
          nationalIdImage: nationalIdImageUrl, // บันทึก URL
          publicId: nationalIdPublicId        // บันทึก Public ID
        },
      });

      // 4. อัปเดต userType
      await tx.user.update({
        where: { id: userId },
        data: {
          userType: "Seller",
        },
      });

      return newSeller;
    });

    res.status(201).json({
      message: "Seller registration successful! Your application is pending review.",
      seller: result,
    });
  } catch (err) {
    console.error(err);
    // กรณีนี้ควรลบรูปที่อัปโหลดไปแล้วออกจาก Cloudinary ด้วยจะดีที่สุด
    // (เป็น advance logic ที่สามารถเพิ่มทีหลังได้)
    res.status(400).json({ message: err.message || "Server error" });
  }
}
