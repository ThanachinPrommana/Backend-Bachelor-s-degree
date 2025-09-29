// controllers/post.js
import prisma from "../config/prisma.js";
import cloudinary from "../utils/cloudinary.js";
import {
  toIntOrNull,
  toFloatOrNull,
  toEnumArray,
  filesOf,
  connectIf
} from "../utils/parse.js";

// อนุญาตตาม enum ใน schema.prisma
const ALLOWED_LANDMARKS = ["BTS_MRT", "School", "Hospital", "Mall_Market", "Park"];
const ALLOWED_AMENITIES = ["Swimming_Pool", "Fitness_Center", "Co_working_Space", "Pet_Friendly"];

// =============== CREATE ==============แก้ไข โดยให้ส้ราง deposit ไปด้วยเลย
export const createpost = async (req, res) => {

  try {
    console.log("Data received from body:", req.body);
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized, please login first" });
    }

    // ดึง userId, userType, และ sellerId จาก session
    const { userId, userType, sellerId } = req.session.user;
    console.log("Id Seller:", sellerId)
    // 2. ตรวจสอบสิทธิ์: เฉพาะ Seller เท่านั้นที่สามารถสร้างโพสต์ได้
    if (userType !== 'Seller' || !sellerId) {
      return res.status(403).json({ message: "Forbidden: Only sellers can create posts." });
    }
    const {
      Property_Name,
      Price,
      Usable_Area,
      Land_Size,
      Bedrooms,
      Description,
      Deposit_Amount,
      Contract_Seller,
      LinkMap,
      Latitude,
      Longitude,
      Province,
      District,
      Subdistrict,
      Address,
      Total_Rooms,
      Year_Built,
      Nearby_Landmarks,
      Additional_Amenities,
      Parking_Space,
      Sell_Rent,
      Link_line,
      Link_facbook,
      Name,
      Phone,
      Bathroom,
      Propertytype,
      Other_related_expenses,
      categoryId,
      Interest,
      floor,
      propertyUnits

    } = req.body;



    if (!Deposit_Amount || Deposit_Amount <= 0) {
      return res.status(400).json({ message: "This post requires a valid deposit amount." });
    }
    // รองรับทั้ง multer.fields() และ multer.array()
    const imageFiles = filesOf(req.files, "images");
    const videoFiles = filesOf(req.files, "videos");


    let parsedPropertyUnits = []; // 1. สร้างตัวแปรใหม่เป็น Array ว่างรอไว้

    // 2. ตรวจสอบว่า propertyUnits ที่รับมาเป็น String หรือไม่
    if (typeof propertyUnits === 'string' && propertyUnits.length > 0) {
      try {
        // 3. ถ้าใช่ ให้แปลง String กลับเป็น Array/Object ด้วย JSON.parse()
        parsedPropertyUnits = JSON.parse(propertyUnits);
      } catch (e) {
        // ถ้าแปลงไม่สำเร็จ แสดงว่าข้อมูลที่ส่งมาผิดรูปแบบ
        return res.status(400).json({ message: "Invalid format for propertyUnits." });
      }
    } else if (Array.isArray(propertyUnits)) {
      // ถ้าส่งมาเป็น Array อยู่แล้ว ก็ใช้ได้เลย
      parsedPropertyUnits = propertyUnits;
    }


    const newPostWithDeposit = await prisma.$transaction(async (tx) => {
      const newPost = await prisma.propertyPost.create({
        data: {
          Property_Name,
          Province,
          District,
          Subdistrict,
          Address,
          Propertytype,
          Description,
          Usable_Area: toFloatOrNull(Usable_Area),
          Land_Size: toFloatOrNull(Land_Size),
          Bedrooms: toIntOrNull(Bedrooms),
          Bathroom: toIntOrNull(Bathroom),
          Total_Rooms: toIntOrNull(Total_Rooms),
          Year_Built, // string ตาม schema

          Nearby_Landmarks: toEnumArray(Nearby_Landmarks, ALLOWED_LANDMARKS),
          Additional_Amenities: toEnumArray(Additional_Amenities, ALLOWED_AMENITIES),

          Deposit_Amount: toFloatOrNull(Deposit_Amount),
          Contract_Seller,
          LinkMap,
          Price: toFloatOrNull(Price),
          Parking_Space: toIntOrNull(Parking_Space),
          Sell_Rent,
          Link_line,
          Link_facbook,
          Name,
          Phone,
          Latitude: toFloatOrNull(Latitude),
          Longitude: toFloatOrNull(Longitude),
          Other_related_expenses,
          Interest: toFloatOrNull(Interest),
          floor: toIntOrNull(floor),
          NumberOfUnits: (parsedPropertyUnits && parsedPropertyUnits.length > 0) ? parsedPropertyUnits.length : 1,
          ...(parsedPropertyUnits && parsedPropertyUnits.length > 0 && {
            PropertyUnit: {
              create: parsedPropertyUnits.map(unit => ({
                Unit_Number: unit.Unit_Number,
              })),
            },
          }),
          ...(connectIf(categoryId) ? { Category: connectIf(categoryId) } : {}),
          user: { connect: { id: userId } },
          seller: {
            connect: {
              id: sellerId
            }
          },
          Image: {
            create: imageFiles.map((file) => ({
              asset_id: file.asset_id,
              public_id: file.public_id || file.filename,
              url: file.path || file.url,
              secure_url: file.secure_url || file.path || file.url,
            })),
          },
          Video: {
            create: videoFiles.map((file) => ({
              asset_id: file.asset_id,
              public_id: file.public_id || file.filename,
              url: file.path || file.url,
              secure_url: file.secure_url || file.path || file.url,
            })),
          },
        },
        include: { Image: true, Video: true },
      });
      await tx.deposit.create({
        data: {
          postId: newPost.id,
          Deposit_Amount: toFloatOrNull(Deposit_Amount),
          Deposit_Status: "PENDING"
        }
      })

      return newPost
    },
      { timeout: 10000 }

    )


    res.status(201).json(newPostWithDeposit);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// =============== LIST (ยังไม่ใช้) ===============
export const list = async (req, res) => {
  try {
    // TODO
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const handleCategory = (where, categoryId) => {
  // รองรับกรณีที่ categoryId อาจเป็น Array หรือค่าเดียว
  const ids = Array.isArray(categoryId) ? categoryId : [categoryId];
  return {
    ...where,
    categoryId: { in: ids },
  };
};

// =============== SEARCH HELPERS ===============
const handleTextQuery = (where, query) => {
  return {
    ...where,
    OR: [
      { Property_Name: { contains: query, mode: "insensitive" } },
      { Description: { contains: query, mode: "insensitive" } },
      { Address: { contains: query, mode: "insensitive" } },
      // เพิ่ม Year_Built ถ้าต้องการค้นหาด้วย แต่ต้องแน่ใจว่า Type เป็น String
      // { Year_Built: { contains: query, mode: "insensitive" } }, 
    ],
  };
};

const handleLocation = (where, { province, district, subdistrict }) => {
  const locationFilters = {};
  if (province) locationFilters.Province = { contains: province, mode: "insensitive" };
  if (district) locationFilters.District = { contains: district, mode: "insensitive" };
  if (subdistrict) locationFilters.Subdistrict = { contains: subdistrict, mode: "insensitive" };

  return {
    ...where,
    ...locationFilters,
  };
};


// ฟังก์ชันสำหรับจัดการเงื่อนไขช่วงราคา (Price Range)
const handlePrice = (where, { minPrice, maxPrice }) => {
  const priceFilter = {};
  if (minPrice) priceFilter.gte = parseInt(minPrice, 10);
  if (maxPrice) priceFilter.lte = parseInt(maxPrice, 10);

  return {
    ...where,
    Price: priceFilter,
  };
};

export const searchFilters = async (req, res) => {
  try {
    // 1. ดึง Filter ทั้งหมดที่เป็นไปได้จาก req.body
    const {
      query,
      categoryId,
      province,
      district,
      subdistrict,
      minPrice,
      maxPrice,
    } = req.body;

    // 2. เริ่มต้น whereClause ด้วยเงื่อนไขพื้นฐานที่ต้องมีเสมอ
    let whereClause = {
      Status_post: "CONFIRMED",
    };

    // 3. เรียกใช้ Handle ต่างๆ เพื่อสร้างเงื่อนไขแบบไดนามิก
    if (query) {
      whereClause = handleTextQuery(whereClause, query);
    }
    if (categoryId) {
      whereClause = handleCategory(whereClause, categoryId);
    }
    if (province || district || subdistrict) {
      whereClause = handleLocation(whereClause, { province, district, subdistrict });
    }
    if (minPrice || maxPrice) {
      whereClause = handlePrice(whereClause, { minPrice, maxPrice });
    }

    // 4. สั่งค้นหาข้อมูลด้วย whereClause ที่สร้างเสร็จสมบูรณ์
    const posts = await prisma.propertyPost.findMany({
      where: whereClause,
      include: {
        Image: true,
        Category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 5. ส่งผลลัพธ์กลับไป
    res.json({ posts });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =============== GET BY CATEGORY ===============
export const getbycategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    console.log("ID:", categoryId);
    const properties = await prisma.propertyPost.findMany({
      where: { categoryId, Status_post: "CONFIRMED" },
      select: {
        id: true,
        Property_Name: true,
        Price: true,
        Province: true,
        Image: { take: 1, select: { url: true } },
      },
    });
    res.json(properties);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// =============== GET SINGLE POST ===============
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.propertyPost.findUnique({
      where: { id },
      select: {
        floor: true, // ✅ จำนวนชั้น
        Property_Name: true,
        Province: true,
        Deposit: true,
        District: true,
        Subdistrict: true,
        Address: true,
        Category: true,
        categoryId: true,
        Usable_Area: true,
        Total_Rooms: true,
        Year_Built: true,
        Nearby_Landmarks: true,
        Image: { select: { url: true, secure_url: true } },
        userId: true,
        Land_Size: true,
        Bedrooms: true,
        Bathroom: true,
        Description: true,
        Deposit_Amount: true,
        LinkMap: true,
        Price: true,
        Additional_Amenities: true,
        Parking_Space: true,
        Sell_Rent: true,
        user: {
          select: {
            First_name: true, Last_name: true, 
            image:true
          }
        },
        Phone: true,
        Latitude: true,
        Longitude: true,
        Other_related_expenses: true,
        Status_post: true,
        PropertyUnit: {
          select: {
            id:true,
            Unit_Number: true,
            Status: true
          }
        },
        NumberOfUnits: true,
        Video: {
          select: {
            url: true,
            secure_url: true
          }
        }
      },
    });

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// =============== REMOVE (ADMIN) ===============
export const removepost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.propertyPost.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const images = await prisma.image.findMany({ where: { propertyPostId: id } });
    const videos = await prisma.video.findMany({ where: { postId: id } });

    // ลบไฟล์บน Cloudinary (ถ้ามี public_id)
    const deleteImagePromises = images.map((img) =>
      img.public_id ? cloudinary.uploader.destroy(img.public_id) : null
    );
    const deleteVideoPromises = videos.map((v) =>
      v.public_id ? cloudinary.uploader.destroy(v.public_id, { resource_type: "video" }) : null
    );
    await Promise.all([...deleteImagePromises, ...deleteVideoPromises]);

    // ลบความสัมพันธ์/ตารางที่เกี่ยวข้อง
    await prisma.deposit.deleteMany({ where: { postId: id } });
    await prisma.image.deleteMany({ where: { propertyPostId: id } });
    await prisma.video.deleteMany({ where: { postId: id } });

    const deletedPost = await prisma.propertyPost.delete({ where: { id } });

    res.json({
      message: "Post and related data deleted successfully",
      deletedPost,
      deletedImages: images,
      deletedVideos: videos,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =============== UPDATE (รองรับอัปเดตรูป & วิดีโอ) ===============
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params; // ID ของโพสต์ที่ต้องการอัปเดต

    // 🔥 1. ตรวจสอบ Session และดึง sellerId
    if (!req.session.user || !req.session.user.sellerId) {
      return res.status(401).json({ message: "Unauthorized or not a seller" });
    }
    const { sellerId } = req.session.user;

    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Invalid or missing request body" });
    }

    const existingPost = await prisma.propertyPost.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 🔥 2. ตรวจสอบความเป็นเจ้าของ
    if (existingPost.sellerId !== sellerId) {
      return res.status(403).json({ message: "Forbidden: You are not the owner of this post" });
    }

    // ฟิลด์ที่อนุญาตให้อัปเดต
    const allowedFields = [
      "Property_Name", "Price", "Usable_Area", "Land_Size", "Bedrooms", "Description",
      "Deposit_Amount", "Contract_Seller", "LinkMap", "Latitude", "Longitude",
      "Province", "District", "Subdistrict", "Address", "Total_Rooms", "Year_Built",
      "Nearby_Landmarks", "Additional_Amenities", "Parking_Space", "Sell_Rent",
      "Link_line", "Link_facbook", "Name", "Phone", "Bathroom", "Propertytype",
      "Other_related_expenses", "categoryId", "Interest", "floor",
    ];

    const asInt = ["Bedrooms", "Bathroom", "Total_Rooms", "Parking_Space", "floor"];
    const asFloat = ["Usable_Area", "Land_Size", "Deposit_Amount", "Price", "Latitude", "Longitude", "Interest"];

    const dataToUpdate = {};
    Object.entries(req.body).forEach(([k, v]) => {
      if (!allowedFields.includes(k)) return;
      if (v === undefined) return;

      if (v === "" || v === null) {
        if (k === "Nearby_Landmarks" || k === "Additional_Amenities") {
          dataToUpdate[k] = { set: [] };
        } else if (k === "categoryId") { // 🔥 3. เพิ่มเงื่อนไขเคลียร์ค่า Category
          dataToUpdate["Category"] = { disconnect: true };
        }
        else {
          dataToUpdate[k] = null;
        }
        return;
      }

      if (asInt.includes(k)) { dataToUpdate[k] = toIntOrNull(v); return; }
      if (asFloat.includes(k)) { dataToUpdate[k] = toFloatOrNull(v); return; }

      if (k === "Nearby_Landmarks") {
        dataToUpdate[k] = { set: toEnumArray(v, ALLOWED_LANDMARKS) };
        return;
      }
      if (k === "Additional_Amenities") {
        dataToUpdate[k] = { set: toEnumArray(v, ALLOWED_AMENITIES) };
        return;
      }

      // 🔥 4. เพิ่มเงื่อนไขสำหรับอัปเดต Category
      if (k === "categoryId") {
        dataToUpdate["Category"] = { connect: { id: v } };
        return;
      }

      dataToUpdate[k] = v;
    });

    const updatedPost = await prisma.propertyPost.update({
      where: { id },
      data: dataToUpdate,
    });

    // ====== อัปเดตสื่อ (รูป/วิดีโอ) เฉพาะเมื่อส่งไฟล์มาใหม่ ======
    const newImages = filesOf(req.files, "images");
    let imageResult = null;
    if (newImages.length > 0) {
      const oldImages = await prisma.image.findMany({ where: { propertyPostId: id } });
      await Promise.all(
        oldImages.map((img) =>
          img.public_id ? cloudinary.uploader.destroy(img.public_id) : null
        )
      );
      await prisma.image.deleteMany({ where: { propertyPostId: id } });

      imageResult = await prisma.image.createMany({
        data: newImages.map((file) => ({
          url: file.path || file.url,
          public_id: file.public_id || file.filename,
          asset_id: file.asset_id,
          secure_url: file.secure_url || file.path || file.url,
          propertyPostId: id,
        })),
      });
    }

    const newVideos = filesOf(req.files, "videos");
    let videoResult = null;
    if (newVideos.length > 0) {
      const oldVideos = await prisma.video.findMany({ where: { postId: id } });
      await Promise.all(
        oldVideos.map((v) =>
          v.public_id ? cloudinary.uploader.destroy(v.public_id, { resource_type: "video" }) : null
        )
      );
      await prisma.video.deleteMany({ where: { postId: id } });

      videoResult = await prisma.video.createMany({
        data: newVideos.map((file) => ({
          url: file.path || file.url,
          public_id: file.public_id || file.filename,
          asset_id: file.asset_id,
          secure_url: file.secure_url || file.path || file.url,
          postId: id,
        })),
      });
    }

    res.json({
      message: "Post updated successfully",
      post: updatedPost,
      image: imageResult,
      video: videoResult,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// =============== CATEGORIES ===============
export const getallcategory = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error in getallcategory:", err);
    res.status(500).json({ message: "Failed to retrieve categories." });
  }
};

export const getHomePagePosts = async (req, res) => {
  try {
    // 1. ดึงข้อมูลผู้ใช้จาก session ที่แนบมากับ request
    const userFromSession = req.session.user;

    // 2. ดึง userId ออกมาจากข้อมูลใน session (ถ้ามี)
    const userId = userFromSession ? userFromSession.userId : null;

    console.log("User ID from session:", userId);

    let buyerPreferences = null;

    // 3. ถ้ามี userId (ผู้ใช้ล็อกอินอยู่) ให้ไปดึงข้อมูลความชอบ
    if (userId) {
      buyerPreferences = await prisma.buyer.findUnique({
        where: { userId: userId },
        select: {
          Preferred_Province: true,
          Preferred_District: true,
        }
      });
    }
    console.log("Buyer Preferences:", buyerPreferences);

    // 4. ดึงโพสต์ทั้งหมดที่เผยแพร่แล้ว
    const allPosts = await prisma.propertyPost.findMany({
      where: { Status_post: "CONFIRMED" },
      select: {
        id: true,
        Province: true,
        District: true,
        Property_Name: true,
        Price: true,
        Image: {
          take: 1,
          select: {
            url: true,
            secure_url: true
          }
        },
      },
      orderBy: { createdAt: 'desc' }
    });

    // 5. ถ้าผู้ใช้ไม่ได้ล็อกอิน หรือไม่มีข้อมูลความชอบ ให้ส่งโพสต์ทั้งหมดกลับไปเลย
    if (!buyerPreferences) {
      return res.json(allPosts);
    }

    // 6. จัดเรียงโพสต์ใหม่: โพสต์ที่ตรงกับความชอบจะขึ้นก่อน
    allPosts.sort((postA, postB) => {
      const aIsMatch = postA.Province === buyerPreferences.Preferred_Province &&
        postA.District === buyerPreferences.Preferred_District;

      const bIsMatch = postB.Province === buyerPreferences.Preferred_District &&
        postB.District === buyerPreferences.Preferred_District;

      if (aIsMatch && !bIsMatch) return -1; // A มาก่อน B
      if (!aIsMatch && bIsMatch) return 1; // B มาก่อน A
      return 0; // ไม่เปลี่ยนลำดับ
    });

    res.json(allPosts);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
