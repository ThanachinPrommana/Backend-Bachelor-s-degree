// controllers/post.js
const Video = require("twilio/lib/rest/Video");
const prisma = require("../config/prisma");
const cloudinary = require("../utils/cloudinary");
const {
  toIntOrNull,
  toFloatOrNull,
  toEnumArray,
  filesOf,
  connectIf,
} = require("../utils/parse");

// อนุญาตตาม enum ใน schema.prisma
const ALLOWED_LANDMARKS = ["BTS_MRT", "School", "Hospital", "Mall_Market", "Park"];
const ALLOWED_AMENITIES = ["Swimming_Pool", "Fitness_Center", "Co_working_Space", "Pet_Friendly"];

// =============== CREATE ===============
exports.createpost = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized, please login first" });
    }

    // ดึง userId, userType, และ sellerId จาก session
    const { userId, userType, sellerId } = req.session.user;

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
    } = req.body;

    // รองรับทั้ง multer.fields() และ multer.array()
    const imageFiles = filesOf(req.files, "images");
    const videoFiles = filesOf(req.files, "videos");

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

        ...(connectIf(categoryId) ? { Category: connectIf(categoryId) } : {}),
        user: { connect: { id: userId } },
        Seller: { connect: { id: sellerId } },

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

    res.status(201).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// =============== LIST (ยังไม่ใช้) ===============
exports.list = async (req, res) => {
  try {
    // TODO
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.handlePrice = async (req, res, price) => {
  // TODO
};

const handlecategory = async (req, res, categoryId) => {
  try {
    const ids = Array.isArray(categoryId) ? categoryId : [categoryId];
    const products = await prisma.propertyPost.findMany({
      where: { categoryId: { in: ids } },
      include: { Image: true, Category: true },
    });
    res.json({ products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.handleSellerRent = async (req, res) => {
  // TODO
};

// =============== SEARCH HELPERS ===============
const handleQuery = async (req, res, query) => {
  try {
    const post = await prisma.propertyPost.findMany({
      where: {
        OR: [
          { Property_Name: { contains: query, mode: "insensitive" } },
          { Year_Built: { contains: query, mode: "insensitive" } },
          { Description: { contains: query, mode: "insensitive" } },
          { Address: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { Category: true, Image: true },
    });
    res.json({ post });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.searchFilters = async (req, res) => {
  try {
    const { query, categoryId } = req.body;
    if (query) {
      console.log("query--->", query);
      await handleQuery(req, res, query);
      return;
    }
    if (categoryId) {
      console.log("categoryId--->", categoryId);
      await handlecategory(req, res, categoryId);
      return;
    }
    res.json({ post: [] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =============== GET BY CATEGORY ===============
exports.getbycategory = async (req, res) => {
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
exports.getPost = async (req, res) => {
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
        user: { select: { First_name: true, Last_name: true } },
        Phone: true,
        Latitude: true,
        Longitude: true,
        Other_related_expenses: true,
        Status_post: true,
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
exports.removepost = async (req, res) => {
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
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Invalid or missing request body" });
    }

    const existingPost = await prisma.propertyPost.findUnique({ where: { id } });
    if (!existingPost) return res.status(404).json({ message: "Post not found" });

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
      if (!allowedFields.includes(k)) return;   // ข้ามฟิลด์ที่ไม่อนุญาต
      if (v === undefined) return;              // ไม่ส่งมา → ไม่แตะ

      if (v === "" || v === null) {            // เคลียร์ค่า
        if (k === "Nearby_Landmarks" || k === "Additional_Amenities") {
          dataToUpdate[k] = { set: [] };
        } else {
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

      dataToUpdate[k] = v; // string/enum เดี่ยว ๆ
    });

    const updatedPost = await prisma.propertyPost.update({
      where: { id },
      data: dataToUpdate,
    });

    // ====== อัปเดตสื่อ (รูป/วิดีโอ) เฉพาะเมื่อส่งไฟล์มาใหม่ ======
    // รูปภาพ
    const newImages = filesOf(req.files, "images");
    let imageResult = null;
    if (newImages.length > 0) {
      // ลบของเก่าทั้ง Cloudinary + DB
      const oldImages = await prisma.image.findMany({ where: { propertyPostId: id } });
      await Promise.all(
        oldImages.map((img) =>
          img.public_id ? cloudinary.uploader.destroy(img.public_id) : null
        )
      );
      await prisma.image.deleteMany({ where: { propertyPostId: id } });

      // ใส่ของใหม่
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

    // วิดีโอ
    const newVideos = filesOf(req.files, "videos");
    let videoResult = null;
    if (newVideos.length > 0) {
      // ลบของเก่าทั้ง Cloudinary + DB
      const oldVideos = await prisma.video.findMany({ where: { postId: id } });
      await Promise.all(
        oldVideos.map((v) =>
          v.public_id ? cloudinary.uploader.destroy(v.public_id, { resource_type: "video" }) : null
        )
      );
      await prisma.video.deleteMany({ where: { postId: id } });

      // ใส่ของใหม่
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
exports.getallcategory = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error in getallcategory:", err);
    res.status(500).json({ message: "Failed to retrieve categories." });
  }
};
