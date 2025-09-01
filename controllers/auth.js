const prisma = require("../config/prisma")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Parking_Needs: ParkingNeedsEnum, Nearby_Facilities: NearbyFacilitiesEnum, Lifestyle_Preferences: LifestylePreferencesEnum } = require("@prisma/client")
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

exports.login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        Email: Email
      },
      include: {
        Seller: true,
        Buyer: true,
      }
    })
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    const is_Match = await bcrypt.compare(Password, user.Password);
    if (!is_Match) {
      return res.status(400).json({ message: "Password invalid" });
    }

    let payload

    if (user.userType === "Seller" && user.Seller) {
      payload = {
        id: user.id,
        Email: user.Email,
        userType: user.userType,
        Phone: user.Phone,
        First_name: user.First_name,
        Last_name: user.Last_name,
        image: user.image,
        Seller: {
          id: user.Seller.id,
          National_ID: user.Seller.National_ID,
          Company_Name: user.Seller.Company_Name,
          RealEstate_License: user.Seller.RealEstate_License,
          Status: user.Seller.Status,
          StartTime: user.Seller.StartTime,
        }
      }
    } else if (user.userType === "Buyer" && user.Buyer) {
      payload = {
        id: user.id,
        Email: user.Email,
        userType: user.userType,
        Phone: user.Phone,
        First_name: user.First_name,
        Last_name: user.Last_name,
        image: user.image,
        Buyer: {
          id: user.Buyer.id,
          Age: user.Buyer.Age,
          Occupation: user.Buyer.Occupation,
          Monthly_Income: user.Buyer.Monthly_Income,
          Family_Size: user.Buyer.Family_Size,
          Preferred_Province: user.Buyer.Preferred_Province,
          Preferred_District: user.Buyer.Preferred_District,
          Parking_Needs: user.Buyer.Parking_Needs,
          Nearby_Facilities: user.Buyer.Nearby_Facilities,
          Lifestyle_Preferences: user.Buyer.Lifestyle_Preferences,
          Special_Requirements: user.Buyer.Special_Requirements,
          DateofBirth: user.Buyer.DateofBirth,
          image: user.Buyer.image,
        }
      };
    }
    req.session.user = payload;

    req.session.save(err => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
      }


      console.log("Login successful, session created for user:", req.session.user.id);

      res.status(200).json({
        message: "Login Sucess",
        user: req.session.user
      });
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error"
    })
  }
}

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
    const { id } = req.session.user;
    if (!id) return res.status(401).json({ message: "Unauthorized" });

    // query database ใหม่
    const user = await prisma.user.findUnique({
      where: { id },
      include: { Seller: true, Buyer: true,PropertyPost:{
        include:{
          Image:true
        }
      } } // include seller info
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
  try {
    const userId = req.session.user.id
    console.log("UserID:",userId)
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in."
      })
    }
    const { National_ID, Company_Name, RealEstate_License } = req.body;
    if (!National_ID || !Company_Name || !RealEstate_License) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // --- START: New Uniqueness Check ---
    const existingSeller = await prisma.seller.findFirst({
      where: {
        OR: [
          { National_ID: National_ID },
          { RealEstate_License: RealEstate_License },
        ],
      },
    });

    if (existingSeller) {
      let errorMessage = "Registration failed. ";
      if (existingSeller.National_ID === National_ID) {
        errorMessage += "This National ID is already registered.";
      } else {
        errorMessage += "This Real Estate License is already registered.";
      }
      return res.status(400).json({ message: errorMessage });
    }
    // --- END: New Uniqueness Check ---

    const userAlreadySeller = await prisma.seller.findUnique({
      where: { userId: userId },
    });

    if (userAlreadySeller) {
      return res
        .status(400)
        .json({ message: "This user is already registered as a seller." });
    }

    // Create the new seller profile
    const newSeller = await prisma.seller.create({
      data: {
        userId: userId,
        National_ID: National_ID,
        Company_Name: Company_Name,
        RealEstate_License: RealEstate_License,
        Status: "PENDING",
      },
    });
    await prisma.user.update({
      where:{
        id:userId
      },
      data:{
        userType:"Seller"
      }
    })

    res.status(201).json({
      message: "Seller registration successful! Your application is pending review.",
      seller: newSeller,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
