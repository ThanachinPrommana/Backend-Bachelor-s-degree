const prisma = require("../config/prisma");
const { Status_Seller, UserType } = require("@prisma/client");
const cloudinary = require("../utils/cloudinary")
const getCloudinaryResourceDetails = async (publicId) => {
  try {
    const resource = await cloudinary.api.resource(publicId);
    return resource;
  } catch (error) {
    console.error("Cloudinary API error:", error);
    return null;
  }
};
exports.updateStatusSeller = async (req, res) => {
  try {
    const { Status } = req.body;
    const { id } = req.params;
    const normalizedStatus = Status?.toUpperCase();
    if (!Object.values(Status_Seller).includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }
    const existingSeller = await prisma.seller.findUnique({
      where: { id },
    });

    if (!existingSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    const seller = await prisma.seller.update({
      where: { id },
      data: { Status },
    });

    res.json(seller);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

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
//แก้ update ผู้ซื้อด้วย
exports.updateSeller = async (req, res) => {
  try {
    const { id } = req.session.user;
    if (!id) {
      return res.status(401).json({
        message: "Unauthorized: Please log in to update your profile."
      });
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      const {
        First_name, Last_name, Phone, image, // User fields (Email ถูกนำออก)
        National_ID, Company_Name, RealEstate_License, // Seller fields
        DateofBirth, Occupation, Monthly_Income, Preferred_Province, Preferred_District // Buyer fields
      } = req.body;

      // Uniqueness Validation (นำส่วนเช็ค Email ออก)
      if (National_ID) {
        const existingSeller = await tx.seller.findFirst({
          where: { National_ID, userId: { not: id } }
        });
        if (existingSeller) throw new Error("This National ID is already in use.");
      }

      const userDataToUpdate = {};
      const sellerDataToUpdate = {};
      const buyerDataToUpdate = {};

      // กำหนด field ที่อนุญาต (นำ 'Email' ออกจาก Array)
      const allowedUserFields = ['First_name', 'Last_name', 'Phone', 'image'];
      const allowedSellerFields = ['National_ID', 'Company_Name', 'RealEstate_License'];
      const allowedBuyerFields = ['DateofBirth', 'Occupation', 'Monthly_Income', 'Preferred_Province', 'Preferred_District'];

      allowedUserFields.forEach(field => {
        if (req.body[field] !== undefined) userDataToUpdate[field] = req.body[field];
      });
      allowedSellerFields.forEach(field => {
        if (req.body[field] !== undefined) sellerDataToUpdate[field] = req.body[field];
      });
      allowedBuyerFields.forEach(field => {
        if (req.body[field] !== undefined) {
          let value = req.body[field];
          if (field === 'DateofBirth') value = new Date(value);
          if (field === 'Monthly_Income') value = parseFloat(value);
          buyerDataToUpdate[field] = value;
        }
      });

      if (Object.keys(sellerDataToUpdate).length > 0) {
        userDataToUpdate.Seller = {
          update: sellerDataToUpdate
        };
      }
      if (Object.keys(buyerDataToUpdate).length > 0) {
        userDataToUpdate.Buyer = {
          update: buyerDataToUpdate
        };
      }

      const user = await tx.user.update({
        where: { id },
        data: userDataToUpdate,
        include: {
          Seller: true,
          Buyer: true
        }
      });

      return user;
    });

    delete updatedUser.Password;
    req.session.user = updatedUser;

    res.json({
      message: "User profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.log(err);
    res.status(err.message.includes("in use") ? 400 : 500).json({
      message: err.message || "Server Error"
    });
  }
};
//complete ลบ email
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.session.user
    if (!id) {
      return res.status(401).json({
        message: "Unauthorized: Please log in to update your profile."
      });
    }
    const {
      First_name,
      Last_name,
      Phone,
      DateofBirth,
      Occupation,
      Monthly_Income,
      Family_Size,
      Parking_Needs,
      Nearby_Facilities,
      Lifestyle_Preferences,
      Special_Requirements,
      image,
      Preferred_Province,
      Preferred_District
    } = req.body;

    // กรองเฉพาะฟิลด์ที่ส่งมา
    const dataToUpdate = {};
    if (First_name !== undefined) dataToUpdate.First_name = First_name;
    if (Last_name !== undefined) dataToUpdate.Last_name = Last_name;
    // if (Email !== undefined) dataToUpdate.Email = Email;
    if (Phone !== undefined) dataToUpdate.Phone = Phone;
    if (image !== undefined) dataToUpdate.image = image;

    const buyerDataToUpdate = {};
    if (DateofBirth !== undefined) buyerDataToUpdate.DateofBirth = new Date(DateofBirth);
    if (Occupation !== undefined) buyerDataToUpdate.Occupation = Occupation;
    if (Monthly_Income !== undefined) buyerDataToUpdate.Monthly_Income = Monthly_Income;
    // if (Family_Size !== undefined) buyerDataToUpdate.Family_Size = Family_Size;
    // if (Parking_Needs !== undefined) buyerDataToUpdate.Parking_Needs = Parking_Needs;
    // if (Nearby_Facilities !== undefined) buyerDataToUpdate.Nearby_Facilities = Nearby_Facilities;
    // if (Lifestyle_Preferences !== undefined) buyerDataToUpdate.Lifestyle_Preferences = Lifestyle_Preferences;
    // if (Special_Requirements !== undefined) buyerDataToUpdate.Special_Requirements = Special_Requirements;
    if (Preferred_Province !== undefined) buyerDataToUpdate.Preferred_Province = Preferred_Province;
    if (Preferred_District !== undefined) buyerDataToUpdate.Preferred_District = Preferred_District;
    // ถ้ามีข้อมูล Buyer ต้องการอัปเดต
    if (Object.keys(buyerDataToUpdate).length > 0) {
      dataToUpdate.Buyer = {
        update: buyerDataToUpdate
      };
    }

    const Updateuser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,

      include: {
        Buyer: true
      }
    });


    if (Updateuser.Password) {
      delete Updateuser.Password;
    }
    req.session.user = Updateuser

    res.json({
      message: "User update success",
      user: Updateuser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};
//complete
exports.updateimage = async (req, res) => {
  try {
    const { id } = req.session.user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = file.path || file.url;
    const publicId = file.filename || file.public_id;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        image: imageUrl,
        publicId: publicId,
      },
    });

    res.status(200).json({
      message: "Image uploaded and user updated successfully",
      image: {
        url: updatedUser.image,
        publicId: updatedUser.publicId,
      },
    });

  } catch (err) {
    console.error("Upload image error:", err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

exports.userdeposit = async (req, res) => {
  try {
    const { userId, postId, Deposit_Amount } = req.body
    if (!userId || !postId || !Deposit_Amount || Deposit_Amount <= 0) {
      return res.status(400).json({
        message: "Invalid deposit request"
      })
    }
    const deposit = await prisma.deposit.create({
      data: {
        userId,
        postId,
        Deposit_Amount,
        Deposit_Status: "PENDING",
      }
    })
    const property = await prisma.propertyPost.findUnique({
      where: {
        id: postId
      }, include: {
        user: true
      }
    })
    await prisma.notification.create({
      data: {
        userId: property.userId,
        Title: "มีคำขอมัดจำใหม่",
        Message: "กรุณาตรวจสอบเอกสารของผู้ซื้อ",
        Status: "UNREAD",
        relatedProcess: "DEPOSIT",
        referenceId: deposit.id
      }
    })

    res.json({ message: "สร้างการมัดจำสำเร็จ", deposit });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Server Error"
    })
  }
}
//complete
exports.useruploadDocument = async (req, res) => {
  try {
    const loggedInUser = req.session.user
    if (!loggedInUser) {
      res.status(401).json({
        message: "Unauthorized: Please log in."
      })
    }
    const userId = loggedInUser.id;


    const { typeId, DocumentName, postId } = req.body
    // const {id} = req.params
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file upload" });
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

exports.getdeposits = async (req, res) => {
  try {
    const { userId } = req.params
    const deposits = await prisma.deposit.findMany({
      where: {
        userId
      },
      include: {
        propertyPost: true
      }
    })
    res.json({
      deposits
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Server Error"
    })
  }
}
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


exports.deletePostBySeller = async (req, res) => {
  try {
    const { postId } = req.params
    const userId = req.session.user?.id
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    const postToDelete = await prisma.propertyPost.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postToDelete) {
      return res.status(404).json({ message: "Post not found." });
    }
    if (postToDelete.userId !== userId) {
      return res.status(403).json({ message: "Forbidden. You are not the owner of this post." });
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

exports.searchFiltersSeller = async (req, res) => {
  try {
    // 1. ดึงข้อมูล user จาก session
    const user = req.session.user;
    if (!user || !user.id) {

      return res.status(401).json({ success: false, message: 'กรุณาเข้าสู่ระบบก่อน' });
    }

    // 2. ดึงคำค้นหา (query) จาก URL query string (เช่น /path?q=บ้าน)
    const { q } = req.query;

    // 3. สร้างเงื่อนไขพื้นฐาน: ต้องเป็นโพสต์ของ user คนนี้เท่านั้น
    const whereClause = {
      userId: user.id,
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












































/*
GET /api/user → ดูผู้ใช้ทั้งหมด

GET /api/user/:id → ดูผู้ใช้ตาม ID

PUT /api/user/:id → แก้ไขข้อมูลผู้ใช้ทั่วไป (First_name, Last_name, Phone ฯลฯ)

DELETE /api/user/:id → ลบผู้ใช้ (พร้อมลบ Buyer/Seller ที่เกี่ยวข้อง)

*/

