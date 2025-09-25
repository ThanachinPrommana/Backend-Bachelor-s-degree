const prisma = require("../config/prisma");
const { Status_Seller, UserType, Status_Disposit } = require("@prisma/client");
const cloudinary = require("../utils/cloudinary");
const { IncomingClientScope } = require("twilio/lib/jwt/ClientCapability");
const getCloudinaryResourceDetails = async (publicId) => {
  try {
    const resource = await cloudinary.api.resource(publicId);
    return resource;
  } catch (error) {
    console.error("Cloudinary API error:", error);
    return null;
  }
};
// admin
exports.updateStatusSeller = async (req, res) => {
  try {
    const { Status } = req.body;
    const { sellerId } = req.params; // ← ใช้ชื่อใหม่ตาม router

    const normalizedStatus = Status?.toUpperCase();
    if (!normalizedStatus) {
      return res.status(400).json({ message: "Status is required" });
    }
    if (!Object.values(Status_Seller).includes(normalizedStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const existingSeller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });
    if (!existingSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const seller = await prisma.seller.update({
      where: { id: sellerId },
      data: { Status: normalizedStatus }, // ← ใช้ค่า normalize
    });

    res.json(seller);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//admin
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    await prisma.user.delete({
      where: { id }
    })
    res.json({
      user
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Server Error",
    })
  }
}
//admin
exports.listUserSeller = async (req, res) => {
  try {

    const listusers = await prisma.user.findMany({
      where: {
        userType: "Seller"
      },
      select: {
        id: true,
        Email: true,
        First_name: true,
        Last_name: true,
        userType: true,
        Seller: true,
        Payment: true,
        Contract: true
      }
    })

    res.json(listusers)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Server Error"
    })
  }
}
//admin
exports.listUserBuyer = async (req, res) => {
  try {

    const listusers = await prisma.user.findMany({
      where: {
        userType: "Buyer"
      },
      select: {
        id: true,
        Email: true,
        First_name: true,
        Last_name: true,
        userType: true,
        Seller: true,
        Payment: true,
        Contract: true
      }
    })

    res.json(listusers)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Server Error"
    })
  }
}
//ไม่ใช้
exports.getSellerProfile = async (req, res) => {
  try {
    const { id } = req.params
    const seller = await prisma.user.findUnique({
      where: {
        id
      },
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
            Status: true
          }
        }
      }

    })
    if (!seller) {
      return res.status(404).json({
        message: "User not found"
      })
    }
    res.json(seller)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Server Error"
    })
  }
}
//ไม่ใช้
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: {
        id
      },
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
            Preferred_Province: true
          }
        }
      }

    })

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }
    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Server Error"
    })
  }
}
// complete (รวม User + Buyer + Seller)
exports.updateSeller = async (req, res) => {
  try {
    const sessionUser = req.session.user;
    if (!sessionUser || !sessionUser.userId) {
      return res.status(401).json({
        message: "Unauthorized: Please log in to update your profile.",
      });
    }

    // 2. ตรวจสอบสิทธิ์: เฉพาะ Seller เท่านั้นที่ควรจะอัปเดตโปรไฟล์ในหน้านี้
    if (sessionUser.userType !== 'Seller') {
      return res.status(403).json({ message: "Forbidden: Only sellers can update this profile." });
    }

    // 3. ใช้ ID ที่ถูกต้องจาก session
    const { userId, sellerId, buyerId } = sessionUser;

    const updatedUserResult = await prisma.$transaction(
      async (tx) => {
        const {
          // User
          First_name,
          Last_name,
          Phone,
          // Seller
          National_ID,
          Company_Name,
          RealEstate_License,
          // Buyer (ครบชุดแบบ Verify)
          DateofBirth,
          Occupation,
          Monthly_Income,
          Family_Size,
          Parking_Needs,
          Nearby_Facilities,
          Lifestyle_Preferences,
          Special_Requirements,
          Preferred_Province,
          Preferred_District,
        } = req.body;

        // เช็คเลขบัตรประชาชนซ้ำ (ข้ามถ้าไม่ได้ส่งมา)
        if (National_ID) {
          const existingSeller = await tx.seller.findFirst({
            where: { National_ID: National_ID, userId: { not: userId } },
          });
          if (existingSeller) {
            throw new Error("This National ID is already in use.");
          }
        }

        const userDataToUpdate = {};
        const sellerDataToUpdate = {};
        const buyerDataToUpdate = {};

        // ===== User =====
        const allowedUserFields = ["First_name", "Last_name", "Phone"];
        allowedUserFields.forEach((field) => {
          if (req.body[field] !== undefined) userDataToUpdate[field] = req.body[field];
        });

        // ===== Seller =====
        const allowedSellerFields = ["National_ID", "Company_Name", "RealEstate_License"];
        allowedSellerFields.forEach((field) => {
          if (req.body[field] !== undefined) sellerDataToUpdate[field] = req.body[field];
        });

        // ===== Buyer (ครบชุด) =====
        const allowedBuyerFields = [
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
        ];

        allowedBuyerFields.forEach((field) => {
          if (req.body[field] === undefined) return;

          let value = req.body[field];

          if (field === "DateofBirth") {
            const d = new Date(value);
            if (!isNaN(d.getTime())) value = d;
            else return; // ข้ามค่าไม่ถูกต้อง
          }

          if (field === "Monthly_Income" || field === "Family_Size") {
            const n = Number(value);
            if (Number.isNaN(n)) return; // ข้ามค่าไม่ใช่ตัวเลข
            value = n;
          }

          // ถ้าฟิลด์เป็น enum ใน Prisma (Parking/Nearby/Lifestyle) คุณสามารถตรวจสอบ whitelist เพิ่มได้ที่นี่
          buyerDataToUpdate[field] = value;
        });

        // แนบ nested update เฉพาะเมื่อมีข้อมูลจะอัปเดตจริง
        if (Object.keys(sellerDataToUpdate).length > 0) {
          userDataToUpdate.Seller = { update: { where: { id: sellerId }, data: sellerDataToUpdate } };
        }
        if (Object.keys(buyerDataToUpdate).length > 0) {
          userDataToUpdate.Buyer = { update: { where: { id: buyerId }, data: buyerDataToUpdate } };
        }

        const user = await tx.user.update({
          where: { id: userId },
          data: userDataToUpdate,
          include: { Seller: true, Buyer: true },
        });

        return user;
      },
      { timeout: 10000 }
    );
    const newSessionPayload = {
      userId: updatedUserResult.id,
      userType: updatedUserResult.userType,
      First_name: updatedUserResult.First_name,
      Last_name: updatedUserResult.Last_name,
      Phone: updatedUserResult.Phone,
      image: updatedUserResult.image,
      buyerId: updatedUserResult.Buyer?.id,
      sellerId: updatedUserResult.Seller?.id,
      Buyer: updatedUserResult.Buyer,
      Seller: updatedUserResult.Seller
    };

    // cleanup
    delete newSessionPayload.Password;

    req.session.user = newSessionPayload;
    req.session.save(err => {
      if (err) {
        console.error("Session update error after profile update:", err);
        // ยังคงส่งข้อมูลกลับไปให้ user ได้ แม้ session จะ save ไม่สำเร็จ
      }
      res.json({
        message: "User profile updated successfully",
        user: newSessionPayload, // ส่งข้อมูลรูปแบบเดียวกับ session กลับไป
      });
    });

  } catch (err) {
    console.log(err);
    res.status(err.message?.includes("in use") ? 400 : 500).json({
      message: err.message || "Server Error",
    });
  }
};

// complete (อัปเดต User + Buyer ฝั่งผู้ซื้อ)
exports.updateUser = async (req, res) => {
  try {
    const sessionUser = req.session.user;
    if (!sessionUser || !sessionUser.userId) {
      return res.status(401).json({
        message: "Unauthorized: Please log in to update your profile.",
      });
    }
    // ดึง ID ที่ถูกต้องจาก session
    const { userId, buyerId } = sessionUser;

    const {
      // User
      First_name,
      Last_name,
      Phone,
      image,
      // Buyer (ครบชุด)
      DateofBirth,
      Occupation,
      Monthly_Income,
      Family_Size,
      Parking_Needs,
      Nearby_Facilities,
      Lifestyle_Preferences,
      Special_Requirements,
      Preferred_Province,
      Preferred_District,
    } = req.body;

    const dataToUpdate = {};
    if (First_name !== undefined) dataToUpdate.First_name = First_name;
    if (Last_name !== undefined) dataToUpdate.Last_name = Last_name;
    if (Phone !== undefined) dataToUpdate.Phone = Phone;
    if (image !== undefined) dataToUpdate.image = image;

    const allowedUserFields = ["First_name", "Last_name", "Phone", "image"];
    allowedUserFields.forEach(field => {
      if (req.body[field] !== undefined) dataToUpdate[field] = req.body[field];
    });

    const buyerDataToUpdate = {};
    const allowedBuyerFields = [
      "DateofBirth", "Occupation", "Monthly_Income", "Family_Size",
      "Parking_Needs", "Nearby_Facilities", "Lifestyle_Preferences",
      "Special_Requirements", "Preferred_Province", "Preferred_District"
    ];
    allowedBuyerFields.forEach(field => {
      if (req.body[field] === undefined) return;
      let value = req.body[field];
      if (field === "DateofBirth") value = new Date(value);
      if (field === "Monthly_Income" || field === "Family_Size") value = Number(value);
      buyerDataToUpdate[field] = value;
    });

    if (Object.keys(buyerDataToUpdate).length > 0) {
      // ตรวจสอบว่าผู้ใช้มีข้อมูล Buyer ให้อัปเดตหรือไม่
      if (!buyerId) {
        return res.status(400).json({ message: "This user does not have a buyer profile to update." });
      }
      dataToUpdate.Buyer = {
        update: {
          where: { id: buyerId },
          data: buyerDataToUpdate
        }
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId }, // ใช้ userId ที่ถูกต้อง
      data: dataToUpdate,
      include: { Buyer: true, Seller: true }, // include Seller ด้วยเผื่อเป็น Seller ที่มาอัปเดต
    });

    // 🔥 --- ส่วนที่แก้ไข --- 🔥
    // 3. สร้าง session payload ใหม่ในรูปแบบที่ถูกต้อง
    const newSessionPayload = {
      userId: updatedUser.id,
      userType: updatedUser.userType,
      First_name: updatedUser.First_name,
      Last_name: updatedUser.Last_name,
      Phone: updatedUser.Phone,
      image: updatedUser.image,
      buyerId: updatedUser.Buyer?.id,
      sellerId: updatedUser.Seller?.id, // ใส่ sellerId ไว้ด้วย (ถ้ามี)
      Buyer: updatedUser.Buyer,
      Seller: updatedUser.Seller, // ใส่ Seller object ไว้ด้วย (ถ้ามี)
    };

    delete newSessionPayload.Password; // ลบ Password ออกเพื่อความปลอดภัย

    // 4. บันทึก session ใหม่และส่ง response กลับ
    req.session.user = newSessionPayload;
    req.session.save(err => {
      if (err) {
        console.error("Session update error after profile update:", err);
      }
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

//complete
exports.updateimage = async (req, res) => {
  try {
    // 🔥 --- ส่วนที่แก้ไข --- 🔥
    // 1. ตรวจสอบและดึง userId ที่ถูกต้องจาก session
    if (!req.session.user || !req.session.user.userId) {
      return res.status(401).json({ message: "Unauthorized, please login first" });
    }
    const { userId } = req.session.user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = file.path;
    const publicId = file.filename;

    const updatedUser = await prisma.user.update({
      where: { id: userId }, // <-- ใช้ userId ที่ถูกต้อง
      data: {
        image: imageUrl,
        publicId: publicId,
      },
    });

    // 🔥 --- ส่วนที่แก้ไข --- 🔥
    // 2. อัปเดตข้อมูลรูปภาพใน session ปัจจุบัน
    req.session.user.image = updatedUser.image;
    req.session.user.publicId = updatedUser.publicId;

    // 3. บันทึก session และส่ง response กลับ (Best Practice)
    req.session.save(err => {
      if (err) {
        console.error("Session save error after image update:", err);
        // แม้ session จะ save ไม่สำเร็จ แต่การอัปเดต DB สำเร็จแล้ว ให้ส่ง response กลับไปก่อน
      }
      res.status(200).json({
        message: "Image uploaded and user updated successfully",
        user: { // ส่งข้อมูล user ที่อัปเดตแล้วกลับไป
          ...req.session.user
        }
      });
    });

  } catch (err) {
    console.error("Upload image error:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

// exports.userdeposit = async (req, res) => {
//   try {
//     const { userId, postId, Deposit_Amount } = req.body
//     if (!userId || !postId || !Deposit_Amount || Deposit_Amount <= 0) {
//       return res.status(400).json({
//         message: "Invalid deposit request"
//       })
//     }
//     const deposit = await prisma.deposit.create({
//       data: {
//         userId,
//         postId,
//         Deposit_Amount,
//         Deposit_Status: "PENDING",
//       }
//     })
//     const property = await prisma.propertyPost.findUnique({
//       where: {
//         id: postId
//       }, include: {
//         user: true
//       }
//     })
//     await prisma.notification.create({
//       data: {
//         userId: property.userId,
//         Title: "มีคำขอมัดจำใหม่",
//         Message: "กรุณาตรวจสอบเอกสารของผู้ซื้อ",
//         Status: "UNREAD",
//         relatedProcess: "DEPOSIT",
//         referenceId: deposit.id
//       }
//     })

//     res.json({ message: "สร้างการมัดจำสำเร็จ", deposit });
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({
//       message: "Server Error"
//     })
//   }
// }
//complete
exports.useruploadDocument = async (req, res) => {
  try {
    const loggedInUser = req.session.user
    if (!loggedInUser || !loggedInUser.userId) {
      return res.status(401).json({
        message: "Unauthorized: Please log in."
      });
    }
    const userId = loggedInUser.userId; // <-- ใช้ userId ที่ถูกต้อง

    const { typeId, DocumentName, postId } = req.body;
    // const {id} = req.params
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file upload" });
    }

    const existingDocument = await prisma.documentUpload.findFirst({
      where: {
        userId: userId,
        postId: postId,
        Review_Status: {
          in: ["PENDING", "APPROVED"] // ตรวจสอบว่ามีเอกสารที่รออนุมัติ หรือ อนุมัติไปแล้วหรือไม่
        }
      }
    });

    // ถ้าเจอเอกสารที่ยัง Active อยู่ ให้ส่ง Error กลับไป
    if (existingDocument) {
      const message = existingDocument.Review_Status === "PENDING"
        ? "คุณมีเอกสารที่รอการตรวจสอบสำหรับโพสต์นี้อยู่แล้ว"
        : "คุณมีเอกสารที่ได้รับการอนุมัติสำหรับโพสต์นี้แล้ว ไม่จำเป็นต้องส่งเอกสารเพิ่มเติม";

      return res.status(409).json({ message }); // 409 Conflict
    }

    // console.log("Uploaded file info:", req.file);
    // console.log("Document URL:", file.path);
    // console.log("File resource_type:", file.resource_type);

    const documentUrl = file.secure_url || file.path || file.url;
    const publicId = file.filename || file.public_id;

    // console.log("PublicId:",publicId)
    // console.log("URL:", documentUrl)

    // const ext = file.mimetype.split("/")[1].toLowerCase();
    // const resourceType = ["pdf", "doc", "docx"].includes(ext) ? "raw" : "image";
    // console.log("Resource Type:", resourceType);

    const document = await prisma.documentUpload.create({
      data: {
        userId: userId,
        typeId,
        DocumentName,
        DocumentUrl: documentUrl,
        CloudinaryPublicId: publicId,
        Review_Status: "PENDING",
        postId,
      },
    });

    const post = await prisma.propertyPost.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await prisma.notification.create({
      data: {
        userId: post.userId,
        Title: "มีเอกสารใหม่สำหรับตรวจสอบมัดจำ",
        Message: `เอกสารมัดจำจาก:${loggedInUser.First_name} ${loggedInUser.Last_name}`,
        Status: "UNREAD",
        relatedProcess: "DOCUMENT_UPLOAD",
        referenceId: document.id,
      },
    });
    await prisma.notification.create({
      data: {
        userId: userId,
        Title: "เอกสารถูกส่งไปยังผู้ขาย",
        Message: "รออนุมัติ",
        Status: "UNREAD",
        relatedProcess: "DOCUMENT_UPLOAD",
        referenceId: document.id,
      }
    })
    res.json({
      message: "Upload document successful and notification sent",
      document,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
//ยังไม่ใช้
exports.getdeposits = async (req, res) => {
  try {
    const userId = req.session.user?.id; // ← ใช้ session
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deposits = await prisma.deposit.findMany({
      where: { userId },
      include: {
        propertyPost: true, // ← ให้ตรงชื่อ relation ใน Prisma ของคุณ
      },
    });

    res.json({ deposits });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//complete ยังไม่ใช้
exports.getpostBySeller = async (req, res) => {
  try {
    const userFromSession = req.session.user
    if (!userFromSession) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const posts = await prisma.propertyPost.findMany({
      where: {
        userId: userFromSession.id
      },
      select: {
        id: true,
        Property_Name: true,
        Price: true,
        Status_post: true,
        Address: true,
        Province: true,
        District: true,
        Image: {
          take: 1,
          select: {
            url: true
          }
        },
        Category: true
      }
    })
    res.json({
      message: "Success",
      posts
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Server Error"
    })
  }
}

//complete
exports.deletePostBySeller = async (req, res) => {
  try {
    const { postId } = req.params
    if (!req.session.user || !req.session.user.userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    const { userId, userType } = req.session.user;

    // 2. ตรวจสอบสิทธิ์: เฉพาะ Seller เท่านั้นที่สามารถลบโพสต์ได้
    if (userType !== 'Seller') {
      return res.status(403).json({ message: "Forbidden. Only sellers can delete posts." });
    }

    const postToDelete = await prisma.propertyPost.findUnique({
      where: {
        id: postId,
      }, include: {
        Image: {
          select: {
            public_id: true
          }
        },
        Video: {
          select: {
            public_id: true
          }
        }
      }
    });

    if (!postToDelete) {
      return res.status(404).json({ message: "Post not found." });
    }
    if (postToDelete.userId !== userId) {
      return res.status(403).json({ message: "Forbidden. You are not the owner of this post." });
    }

    if (postToDelete.Image && postToDelete.Image.length > 0) {
      const imagePublicIds = postToDelete.Image
        // ✅ แก้ไข field name ให้ถูกต้อง
        .map(img => img.public_id)
        .filter(id => id); // กรองค่า null ออก

      if (imagePublicIds.length > 0) {
        await cloudinary.api.delete_resources(imagePublicIds);
      }
    }

    // ลบวิดีโอทั้งหมด
    if (postToDelete.Video && postToDelete.Video.length > 0) {
      const videoPublicIds = postToDelete.Video
        // ✅ แก้ไข field name ให้ถูกต้อง
        .map(vid => vid.public_id)
        .filter(id => id);

      if (videoPublicIds.length > 0) {
        await cloudinary.api.delete_resources(videoPublicIds, { resource_type: 'video' });
      }
    }

    // --- Start Transaction ---
    // ใช้ transaction เพื่อลบข้อมูลที่เกี่ยวข้องกันทั้งหมด
    await prisma.$transaction([
      // 1. ลบรูปภาพทั้งหมดที่เชื่อมกับ postId นี้
      prisma.image.deleteMany({
        where: {
          propertyPostId: postId,
        },
      }),
      // 2. ลบวิดีโอทั้งหมดที่เชื่อมกับ postId นี้
      prisma.video.deleteMany({
        where: {
          postId: postId,
        },
      }),
      // 3. ลบตัวโพสต์หลัก
      prisma.propertyPost.delete({
        where: {
          id: postId,
        },
      }),
    ]);
    res.status(200).json({ message: "Delete Success" });

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Server Error"
    })
  }
}
//complete
exports.searchFiltersSeller = async (req, res) => {
  try {
    // 1. ดึงข้อมูล user จาก session
    if (!req.session.user || !req.session.user.userId) {
      return res.status(401).json({ success: false, message: 'กรุณาเข้าสู่ระบบก่อน' });
    }
    const { userId, userType } = req.session.user;

    // 2. ตรวจสอบสิทธิ์: เฉพาะ Seller เท่านั้นที่สามารถค้นหาโพสต์ของตัวเองได้
    if (userType !== 'Seller') {
      return res.status(403).json({ success: false, message: 'Forbidden: Only sellers can access this resource.' });
    }

    // 2. ดึงคำค้นหา (query) จาก URL query string (เช่น /path?q=บ้าน)
    const { q } = req.query;

    // 3. สร้างเงื่อนไขพื้นฐาน: ต้องเป็นโพสต์ของ user คนนี้เท่านั้น
    const whereClause = {
      userId: userId,
    };

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

    // 5. ค้นหาข้อมูลด้วยเงื่อนไขที่สร้างขึ้น และดึงข้อมูลที่เกี่ยวข้องมาด้วย
    const posts = await prisma.propertyPost.findMany({
      where: whereClause,
      include: {
        Category: true,
        Image: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    // 6. ส่งผลลัพธ์กลับไป
    res.status(200).json({ success: true, count: posts.length, data: posts });

  } catch (err) {
    console.error("Error in searchFiltersSeller:", err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
  }
};
//complete ใช้แบบ stripe ส่วนนี้ยังคงไม่ต้องใช้
exports.createdeposite = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user || !user.userId) {
      return res.status(401).json({
        message: "Unauthorized: Please log in to make a deposit."
      });
    }



    // 3. ใช้ ID ที่ถูกต้องจาก session
    const userId = user.userId;
    const { postId, documentId } = req.body;

    if (!postId || !documentId) {
      return res.status(400).json({
        message: "Missing required fields: postId and documentId are required."
      });
    }

    const post = await prisma.propertyPost.findUnique({
      where: {
        id: postId
      },
      select: {
        userId: true,
        Deposit_Amount: true
      }
    })


    if (!post) {
      return res.status(404).json({
        message: "Post not found."
      })
    }
    if (!post.Deposit_Amount || post.Deposit_Amount <= 0) {
      return res.status(400).json({ message: "This post does not require a deposit." });
    }

    const depositAmountFromPost = post.Deposit_Amount

    const document = await prisma.documentUpload.findUnique({
      where: {
        id: documentId
      }
    })
    if (!document) {
      return res.status(404).json({ message: "Associated document not found." });
    }
    if (document.userId !== userId) {
      return res.status(403).json({
        message: `Action forbidden: Document status is '${document.Review_Status}', not 'APPROVED'.`
      });
    }
    if (document.Review_Status !== "APPROVED") {
      return res.status(403).json({
        message: `Action forbidden: Document status is '${document.Review_Status}', not 'APPROVED'.`
      });
    }

    const existingDeposit = await prisma.deposit.findFirst({
      where: {
        postId: postId,
        Deposit_Status: {
          in: ["PENDING", "CONFIRMED"] // ตรวจสอบสถานะทั้ง PENDING และ CONFIRMED
        }
      }
    });

    // ถ้าเจอว่ามีมัดจำที่ Active อยู่แล้ว ให้ส่ง Error กลับไป
    if (existingDeposit) {
      return res.status(409).json({ // 409 Conflict คือ status code ที่เหมาะสมที่สุด
        message: "ไม่สามารถทำรายการได้ เนื่องจากมีผู้ทำรายการมัดจำสำหรับโพสต์นี้อยู่แล้วหรือมัดจำสำเร็จแล้ว"
      });
    }

    const newDeposit = await prisma.$transaction(async (tx) => {
      const deposit = await tx.deposit.create({
        data: {
          postId: postId,
          userId: userId, // <-- ใช้ userId ที่ถูกต้อง
          Deposit_Amount: depositAmountFromPost,
          Deposit_Status: "PENDING"
        }
      });

      await tx.documentUpload.update({
        where: { id: documentId },
        data: { depositId: deposit.id }
      });

      return deposit;
    });

    // แจ้งเตือนไปยังเจ้าของโพสต์ (Seller)
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

    // แจ้งเตือนยืนยันไปยังผู้ซื้อ (Buyer)
    await prisma.notification.create({
      data: {
        userId: userId,
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
}
//complete ใช้แบบ stripe ส่วนนี้ยังคงไม่ต้องใช้
exports.updateDepositStatus = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user || !user.userId) {
      return res.status(401).json({ message: "Unauthorized: โปรดเข้าสู่ระบบ" });
    }

    // 2. ตรวจสอบสิทธิ์: เฉพาะ Seller เท่านั้นที่สามารถอัปเดตสถานะได้
    if (user.userType !== 'Seller') {
      return res.status(403).json({ message: "Forbidden: Only sellers can update deposit status." });
    }

    const sellerUserId = user.userId; // ID ของ User ที่เป็น Seller
    const { depositId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["CONFIRMED", "REJECTED"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status: สถานะต้องเป็น ${allowedStatuses.join(" หรือ ")} เท่านั้น`,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const deposit = await tx.deposit.findUnique({
        where: { id: depositId },
        include: {
          // เปลี่ยนชื่อ relation ให้ตรงกับ Prisma ของคุณ
          // ถ้า relation ชื่อ propertyPost:
          Post: { select: { userId: true } },
          // ถ้า relation ชื่อ Post ให้ใช้:
          // Post: { select: { userId: true } },
        },
      });

      if (!deposit) throw new Error("Deposit not found: ไม่พบรายการมัดจำนี้");

      // ตรวจเจ้าของโพสต์ให้ตรงกับ relation ที่ใช้ด้านบน
      const postOwnerId = deposit.Post?.userId /* หรือ deposit.Post?.userId */;
      if (postOwnerId !== sellerUserId) {
        throw new Error("Forbidden: คุณไม่มีสิทธิ์ในการจัดการรายการมัดจำนี้");
      }
      if (deposit.Deposit_Status !== "PENDING") {
        throw new Error(
          `Conflict: รายการมัดจำนี้ไม่ได้อยู่ในสถานะ PENDING (สถานะปัจจุบัน: ${deposit.Deposit_Status})`
        );
      }

      const updatedDeposit = await tx.deposit.update({
        where: { id: depositId },
        data: { Deposit_Status: status },
      });

      const buyerId = updatedDeposit.userId;

      const map = {
        CONFIRMED: {
          Title: "การมัดจำของคุณได้รับการยืนยันแล้ว",
          Message: "ผู้ขายได้ยืนยันการชำระเงินมัดจำสำหรับโพสต์เรียบร้อยแล้ว",
          relatedProcess: "DEPOSIT_CONFIRMED",
        },
        REJECTED: {
          Title: "การมัดจำของคุณถูกปฏิเสธ",
          Message:
            "ผู้ขายได้ปฏิเสธการมัดจำของคุณ กรุณาติดต่อผู้ขายเพื่อสอบถามรายละเอียดเพิ่มเติม",
          relatedProcess: "DEPOSIT_REJECTED",
        },
      };

      const meta = map[status];

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
    res.status(500).json({ message: "Server Error" }); // ← แก้ .json()
  }
};


exports.searchFillerDiposit = async (req, res) => {
  try {
    const user = req.session.user
    if (!user || !user.userId) {
      return res.status(401).json({ success: false, message: 'กรุณาเข้าสู่ระบบก่อน' });
    }
    const userId = user.userId;
    const {
      q,
      status,
      minAmount,
      maxAmount,
    } = req.body

    const where = {
      userId: userId
    }

    if (q) {
      where.OR = [
        { Post: { Property_Name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    if (status && Object.values(Status_Disposit).includes(status)) {
      where.Deposit_Status = status;
    }

    if (minAmount || maxAmount) {
      where.Deposit_Amount = {}
      if (minAmount) {
        where.Deposit_Amount.gte = parseFloat(minAmount)
      }
      if (maxAmount) {
        where.Deposit_Amount.lte = parseFloat(maxAmount);
      }
    }

    const deposits = await prisma.deposit.findMany({
      where,
      include: {
        Post: {
          select: {
            id: true,
            Property_Name: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    res.status(200).json({
      message: "Success",
      data: deposits
    })

  } catch (err) {
    console.error('Error searching user deposits:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}
//createDateSlot
exports.createDateTimeSlot = async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Unauthorized: กรุณาเข้าสู่ระบบก่อน' });
  }

  // 🔥 --- ส่วนที่แก้ไข --- 🔥
  // 1. ดึง sellerId จาก session ไม่ใช่ userId
  const sellerId = req.session.user.sellerId;

  // 2. ตรวจสอบว่า user คนนี้มี sellerId หรือไม่ (เป็น Seller จริงหรือไม่)
  if (!sellerId) {
    return res.status(403).json({ message: 'Forbidden: คุณไม่มีสิทธิ์ในการสร้างช่วงเวลา' });
  }

  const { date, timeSlots } = req.body;

  if (!date || !timeSlots || !Array.isArray(timeSlots) || timeSlots.length === 0) {
    return res.status(400).json({
      message: 'กรุณาระบุ date (YYYY-MM-DD) และ timeSlots ที่เป็น array',
    });
  }

  try {
    const slotsToCreate = [];

    for (const slot of timeSlots) {
      if (!slot.startTime || !slot.endTime) {
        throw new Error('ข้อมูลใน timeSlots ไม่สมบูรณ์ กรุณาระบุ startTime และ endTime');
      }

      const startDate = new Date(`${date}T${slot.startTime}:00`);
      const endDate = new Date(`${date}T${slot.endTime}:00`);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error(`รูปแบบเวลาไม่ถูกต้อง: ${slot.startTime}-${slot.endTime}`);
      }
      if (startDate >= endDate) {
        throw new Error(`เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น: ${slot.startTime}-${slot.endTime}`);
      }

      const existingSlot = await prisma.dateTimeSlot.findFirst({
        where: {
          sellerId: sellerId, // <-- ค่านี้จะถูกต้องแล้ว
          AND: [{ startTime: { lt: endDate } }, { endTime: { gt: startDate } }],
        },
      });

      if (existingSlot) {
        throw new Error(`ช่วงเวลา ${slot.startTime}-${slot.endTime} ทับซ้อนกับ Slot ที่มีอยู่แล้ว`);
      }

      slotsToCreate.push({
        startTime: startDate,
        endTime: endDate,
        sellerId: sellerId, // <-- ค่านี้จะถูกต้องแล้ว
      });
    }

    for (let i = 0; i < slotsToCreate.length; i++) {
      for (let j = i + 1; j < slotsToCreate.length; j++) {
        const slotA = slotsToCreate[i];
        const slotB = slotsToCreate[j];
        if (slotA.startTime < slotB.endTime && slotA.endTime > slotB.startTime) {
          throw new Error(`ข้อมูลช่วงเวลาที่ส่งมาทับซ้อนกันเอง`);
        }
      }
    }

    const result = await prisma.dateTimeSlot.createMany({
      data: slotsToCreate,
    });

    res.status(201).json({
      message: `สร้างช่วงเวลาสำเร็จทั้งหมด ${result.count} รายการ`,
      count: result.count,
    });

  } catch (error) {
    res.status(400).json({ message: error.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์' });
  }
};

//createbooking
exports.createBooking = async (req, res) => {
  if (!req.session.user || !req.session.user.userId || !req.session.user.userType) {
    return res.status(401).json({ message: 'Unauthorized: กรุณาเข้าสู่ระบบก่อน' });
  }
  
  const { userId: bookerId, userType: bookerUserType, buyerId: sessionBuyerId, sellerId: sessionSellerId } = req.session.user;
  const { dateTimeSlotId, buyerId: buyerIdFromRequest } = req.body;

  if (!dateTimeSlotId) {
    return res.status(400).json({ message: 'กรุณาระบุ dateTimeSlotId' });
  }

  // 2. ตรวจสอบเงื่อนไขเฉพาะของ Seller
  // --- เปลี่ยนจาก 'SELLER' เป็นค่าใน Enum UserType ของคุณ (ถ้ามี) ---
  // สมมติว่าค่าใน session คือ 'Seller'
  if (bookerUserType === 'Seller' && !buyerIdFromRequest) {
    return res.status(400).json({ message: 'สำหรับผู้ขาย กรุณาระบุ buyerId ของลูกค้าที่ต้องการนัดหมาย' });
  }

  try {

    const newBooking = await prisma.$transaction(async (tx) => {
      const slot = await tx.dateTimeSlot.findUnique({
        where: { id: dateTimeSlotId },
      });

      if (!slot) {
        throw new Error('NOT_FOUND');
      }
      if (slot.isBooked) {
        throw new Error('ALREADY_BOOKED');
      }

      let buyerId;
      let sellerId;

      // 3. กำหนดค่า buyerId และ sellerId ตาม userType ของผู้จอง
      if (bookerUserType === 'Buyer') {
        buyerId = sessionBuyerId;
        sellerId = slot.sellerId;
      } else if (bookerUserType === 'Seller') {
        // --- Security Check ---
        if (slot.sellerId !== sessionSellerId) {
          throw new Error('FORBIDDEN');
        }
        buyerId = buyerIdFromRequest;
        sellerId = sessionSellerId;
      } else {
        throw new Error('INVALID_USER_TYPE');
      }

      // อัปเดต Slot ให้เป็น isBooked = true
      await tx.dateTimeSlot.update({
        where: { id: dateTimeSlotId },
        data: { isBooked: true },
      });

      // สร้าง Booking
      const booking = await tx.booking.create({
        data: {
          buyerId,
          sellerId,
          dateTimeSlotId,
        },
      });

      return booking;
    });

    res.status(201).json({
      message: 'การจองนัดหมายสำเร็จ',
      booking: newBooking,
    });

  } catch (error) {
    // 5. จัดการ Error ที่เกิดขึ้นระหว่าง Transaction
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'ไม่พบช่วงเวลาที่คุณต้องการจอง' });
    }
    if (error.message === 'ALREADY_BOOKED') {
      return res.status(409).json({ message: 'ขออภัย ช่วงเวลานี้ถูกจองไปแล้ว' }); // 409 Conflict
    }

    // สำหรับ Error อื่นๆ ที่ไม่คาดคิด
    console.error('เกิดข้อผิดพลาดในการสร้าง Booking:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์' });
  }
};
exports.revmovedeposit = async (req, res) => {
  try {
    const user = req.session.user
    if (!user || !user.userId) {
      return res.status(401).json({ message: "Unauthorized: กรุณาเข้าสู่ระบบก่อน" });
    }
    const userName = `${user.First_name} ${user.Last_name}`
    const userId = user.userId;
    const { id: depositId } = req.params
    const deposit = await prisma.deposit.findUnique({
      where: {
        id: depositId
      },
      include: {
        Post: {
          select: {
            id: true,
            Property_Name: true,
            userId: true
          }
        }
      }
    })
    if (!deposit) {
      return res.status(404).json({ message: "ไม่พบรายการมัดจำที่คุณต้องการลบ" });
    }
    if (deposit.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: คุณไม่มีสิทธิ์ในการลบรายการมัดจำนี้" });
    }
    if (deposit.Deposit_Status !== "PENDING") {
      return res.status(409).json({ // 409 Conflict
        message: `ไม่สามารถลบได้ เนื่องจากรายการมัดจำนี้อยู่ในสถานะ "${deposit.Deposit_Status}" แล้ว`
      });
    }
    await prisma.$transaction(async (tx) => {
      await tx.documentUpload.updateMany({
        where: {
          depositId: depositId
        },
        data: {
          deposit: null
        }
      })
      await tx.deposit.delete({
        where: {
          id: depositId
        }
      })
      await tx.notification.create({
        data: {
          userId: deposit.Post.userId, // ID ของเจ้าของโพสต์
          Title: "มีการยกเลิกการมัดจำ",
          Message: `ผู้ใช้ ${userName} ได้ยกเลิกการมัดจำสำหรับโพสต์ "${deposit.Post.Property_Name}" ของคุณ`,
          Status: "UNREAD",
          relatedProcess: "DEPOSIT_CANCELLED",
          referenceId: deposit.Post.id,
        }
      })
    })
    res.json({
      message: "ลบรายการมัดจำสำเร็จ",
      deleteDeposit: deposit
    })
  } catch (err) {
    console.error("Error removing deposit:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
}
exports.removeTimeSlot = async (req, res) => {
  try {
    // 1. ตรวจสอบ session และสิทธิ์การเป็นผู้ขาย
    const user = req.session.user;
    if (!user || !user.userId || user.userType !== 'Seller') {
      return res.status(403).json({ message: "Forbidden: เฉพาะผู้ขายเท่านั้นที่สามารถลบช่วงเวลาได้" });
    }
    const sellerId = user.sellerId;
    if (!sellerId) {
      return res.status(403).json({ message: "Forbidden: ข้อมูลผู้ขายไม่สมบูรณ์" });
    }

    // 2. ดึง ID ของช่วงเวลาที่จะลบจาก URL params
    const { timeSlotId } = req.params;

    // 3. ค้นหาช่วงเวลานั้นในฐานข้อมูล
    const timeSlot = await prisma.dateTimeSlot.findUnique({
      where: { id: timeSlotId },
    });

    // 4. ตรวจสอบว่ามีช่วงเวลานี้อยู่จริงหรือไม่
    if (!timeSlot) {
      return res.status(404).json({ message: "ไม่พบช่วงเวลาที่ต้องการลบ" });
    }

    // 5. ตรวจสอบความเป็นเจ้าของ (Authorization)
    if (timeSlot.sellerId !== sellerId) {
      return res.status(403).json({ message: "Forbidden: คุณไม่มีสิทธิ์ลบช่วงเวลาของผู้ขายท่านอื่น" });
    }

    // 6. 🔥 แก้ไข: ใช้ Transaction เพื่อลบ Booking และ DateTimeSlot พร้อมกัน
    const deletedSlot = await prisma.$transaction(async (tx) => {
      // 6.1 ลบข้อมูลการจอง (Booking) ที่เกี่ยวข้องออกไปก่อน
      // ใช้ deleteMany เพื่อไม่ให้เกิด error หากไม่มีการจอง
      await tx.booking.deleteMany({
        where: { dateTimeSlotId: timeSlotId },
      });

      // 6.2 ลบช่วงเวลา (DateTimeSlot)
      const result = await tx.dateTimeSlot.delete({
        where: { id: timeSlotId },
      });

      return result;
    });

    // 7. ส่ง Response กลับไปว่าสำเร็จ พร้อมกับข้อมูลที่ถูกลบ
    res.status(200).json({
      message: "ลบช่วงเวลาและข้อมูลการจองที่เกี่ยวข้องสำเร็จ",
      deletedSlot: deletedSlot,
    });

  } catch (err) {
    console.error("Error removing time slot:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};
exports.removeBooking = async (req, res) => {
  try {
    const user = req.session.user
    if (!user || !user.userId) {
      return res.status(401).json({ message: "Unauthorized: กรุณาเข้าสู่ระบบก่อน" });
    }
    const { userId, First_name, Last_name } = user
    const userName = `${First_name} ${Last_name}`;
    const { bookingId } = req.params

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId
      },
      include: {
        Buyer: {
          select: {
            userId: true
          }
        },
        Seller: {
          select: {
            userId: true
          }
        },
        dateTimeSlot: {
          select: {
            id: true,
            startTime: true
          }
        }
      }
    })
    if (!booking) {
      return res.status(404).json({
        message: "ไม่พบข้อมูลการจอง"
      })
    }
    const isBuyer = booking.Buyer.userId === userId
    const isSeller = booking.Seller.userId === userId
    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: "Forbidden: คุณไม่มีสิทธิ์ในการยกเลิกการจองนี้" });
    }
    const deletedBooking = await prisma.$transaction(async (tx) => {
      await tx.dateTimeSlot.update({
        where: {
          id: booking.dateTimeSlot.id
        },
        data: {
          isBooked: false
        }
      })
      const result = tx.booking.delete({
        where: {
          id: bookingId
        }
      })
      let notificationRecipientId
      let notificationMessage
      const appointmentTime = new Date(booking.dateTimeSlot.startTime).toLocaleString("th-TH")

      if (isBuyer) {
        notificationRecipientId = booking.Seller.userId
        notificationMessage = `ผู้ใช้ ${userName} ได้ยกเลิกการนัดหมายในวันที่ ${appointmentTime}`
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
          Status:"UNREAD"
        }
      })
      return result
    })

    res.json({
      message:"ยกเลิกการจองสำเร็จ",
      deletedBooking:deletedBooking
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message:"Server Error"
    })
  }
}











































































/*
GET /api/user → ดูผู้ใช้ทั้งหมด

GET /api/user/:id → ดูผู้ใช้ตาม ID

PUT /api/user/:id → แก้ไขข้อมูลผู้ใช้ทั่วไป (First_name, Last_name, Phone ฯลฯ)

DELETE /api/user/:id → ลบผู้ใช้ (พร้อมลบ Buyer/Seller ที่เกี่ยวข้อง)

*/

