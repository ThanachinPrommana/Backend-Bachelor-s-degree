// controllers/post.js
import prisma from "../config/prisma.js";
import cloudinary from "../utils/cloudinary.js";
import {
  toIntOrNull,
  toFloatOrNull,
  toEnumArray,
  filesOf,
  connectIf,
} from "../utils/parse.js";

/* ========= Allowed enums (must match schema.prisma) ========= */
const ALLOWED_LANDMARKS = [
  "BTS_MRT",
  "School",
  "Hospital",
  "Mall_Market",
  "Park",
];
const ALLOWED_AMENITIES = [
  "Swimming_Pool",
  "Fitness_Center",
  "Co_working_Space",
  "Pet_Friendly",
];

/* ========= Helpers ========= */
const toStrArray = (v) =>
  Array.isArray(v) ? v.map(String) : v ? [String(v)] : [];

const toIntOrZero = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
};
const toFloatOrZero = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

/** CloudinaryStorage pass-through mapper
 *  - Multer-Storage-Cloudinary เติม:
 *    file.path     = secure_url (https://...)
 *    file.filename = public_id
 *    file.mimetype = image/* | video/*
 */
const prepareAsset = (file) => {
  const url = file?.path || file?.secure_url || file?.url || null;
  const public_id = file?.filename || file?.public_id || null;
  const asset_id = file?.asset_id ?? null;
  if (!url) return null;
  return { asset_id, public_id, url, secure_url: url };
};

/* =============== CREATE (CloudinaryStorage pass-through + nested create) =============== */
export const createpost = async (req, res) => {
  console.log("req.files received:", JSON.stringify(req.files, null, 2));
  try {
    if (!req.session?.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized, please login first" });
    }

    // ===== Logs: files =====
    const imageFiles = filesOf(req.files, "images");
    const videoFiles = filesOf(req.files, "videos");
    console.log(
      "[createpost] files keys:",
      req.files ? Object.keys(req.files) : null
    );
    console.log("[createpost] images count:", imageFiles.length);
    console.log("[createpost] videos count:", videoFiles.length);
    if (imageFiles[0]) {
      const f = imageFiles[0];
      console.log("[createpost] sample image file:", {
        fieldname: f.fieldname,
        mimetype: f.mimetype,
        filename: f.filename, // public_id
        path: f.path, // secure_url
        size: f.size,
      });
    }
    if (videoFiles[0]) {
      const v = videoFiles[0];
      console.log("[createpost] sample video file:", {
        fieldname: v.fieldname,
        mimetype: v.mimetype,
        filename: v.filename,
        path: v.path,
        size: v.size,
      });
    }

    const { userId, userType, sellerId } = req.session.user || {};

    // ===== Only Seller =====
    let effectiveSellerId = sellerId;
    if (userType === "Seller" && !effectiveSellerId) {
      const seller = await prisma.seller.findFirst({
        where: { userId },
        select: { id: true },
      });
      if (seller) effectiveSellerId = seller.id;
    }
    if (userType !== "Seller" || !effectiveSellerId) {
      return res
        .status(403)
        .json({ message: "Forbidden: Only sellers can create posts." });
    }

    // ===== Body =====
    const {
      Property_Name,
      Price,
      Usable_Area,
      Land_Size,
      Bedrooms,
      Description,
      Deposit_Amount,
      Deposit_Percent, // <— เพิ่มอ่านเปอร์เซ็นต์
      LinkMap,
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
      Other_related_expenses,
      categoryId,
      floor,
      propertyUnits, // JSON string หรือ array
    } = req.body;

    const isSale = String(Sell_Rent || "").toUpperCase() === "SALE";

    // เตรียมเลข
    const priceNum = toFloatOrNull(Price);
    const percentNumRaw = toFloatOrNull(Deposit_Percent);
    const percentNum =
      percentNumRaw == null ? null : Math.max(0, Math.min(100, percentNumRaw));
    let depositAmountNum = toFloatOrNull(Deposit_Amount);

    // ถ้า SALE และไม่ได้ส่งจำนวนเงิน แต่มีเปอร์เซ็นต์+ราคา → คำนวณเงินดาวน์
    if (isSale && (depositAmountNum == null || depositAmountNum <= 0)) {
      if (percentNum != null && priceNum != null && priceNum > 0) {
        depositAmountNum =
          Math.round(priceNum * (percentNum / 100) * 100) / 100;
      }
    }
    // บังคับมีเงินดาวน์ (จำนวน) เมื่อ SALE
    if (isSale && (!depositAmountNum || depositAmountNum <= 0)) {
      return res
        .status(400)
        .json({ message: "กรุณาระบุเงินดาวน์สำหรับการขาย" });
    }

    // อย่างน้อย 1 รูป
    if (imageFiles.length === 0) {
      return res
        .status(400)
        .json({ message: "กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป" });
    }

    // map ไฟล์
    const imageData = imageFiles.map(prepareAsset).filter(Boolean);
    const videoData = videoFiles.map(prepareAsset).filter(Boolean);

    // parse propertyUnits
    let parsedPropertyUnits = [];
    if (typeof propertyUnits === "string" && propertyUnits.trim().length > 0) {
      try {
        parsedPropertyUnits = JSON.parse(propertyUnits);
      } catch {
        return res
          .status(400)
          .json({ message: "Invalid format for propertyUnits." });
      }
    } else if (Array.isArray(propertyUnits)) {
      parsedPropertyUnits = propertyUnits;
    }

    // เตรียม data
    const createData = {
      Property_Name,
      Province,
      District,
      Subdistrict,
      Address,
      Description,

      Usable_Area: toFloatOrNull(Usable_Area) ?? 0,
      Land_Size: toFloatOrNull(Land_Size) ?? 0,
      Bedrooms: toIntOrNull(Bedrooms) ?? 0,
      Bathroom: toIntOrNull(Bathroom) ?? 0,

      Total_Rooms: toIntOrNull(Total_Rooms),
      Year_Built: Year_Built || null,

      Nearby_Landmarks: toEnumArray(Nearby_Landmarks, ALLOWED_LANDMARKS),
      Additional_Amenities: toEnumArray(
        Additional_Amenities,
        ALLOWED_AMENITIES
      ),

      Deposit_Amount: depositAmountNum, // <— ใช้ค่าที่คำนวณแล้ว
      Deposit_Percent: percentNum, // <— เก็บเปอร์เซ็นต์ไว้ด้วย
      LinkMap: LinkMap || null,
      Price: priceNum ?? 0,
      Parking_Space: toIntOrNull(Parking_Space),
      Sell_Rent,
      Link_line: Link_line || null,
      Link_facbook: Link_facbook || null,
      Name: Name || null,
      Phone,
      Other_related_expenses: toStrArray(Other_related_expenses),
      floor: toIntOrNull(floor),

      NumberOfUnits:
        parsedPropertyUnits?.length > 0 ? parsedPropertyUnits.length : 1,

      ...(parsedPropertyUnits?.length > 0 && {
        PropertyUnit: {
          create: parsedPropertyUnits
            .map((u) => String(u?.Unit_Number || "").trim())
            .filter(Boolean)
            .map((Unit_Number) => ({ Unit_Number })),
        },
      }),

      ...(connectIf(categoryId) ? { Category: connectIf(categoryId) } : {}),

      user: { connect: { id: userId } },
      seller: { connect: { id: effectiveSellerId } },

      // NESTED children
      Image: imageData.length ? { create: imageData } : undefined, // FK: propertyPostId
      Video: videoData.length ? { create: videoData } : undefined, // FK: postId
    };

    // Logs: summary
    console.log("[createpost] about to create post with:", {
      Property_Name,
      Province,
      District,
      Subdistrict,
      Price: createData.Price,
      Bedrooms: createData.Bedrooms,
      Bathroom: createData.Bathroom,
      Sell_Rent,
      categoryId,
      imagesToCreate: imageData.length,
      videosToCreate: videoData.length,
      hasUnits: Boolean(parsedPropertyUnits?.length),
      NumberOfUnits: createData.NumberOfUnits,
      Deposit_Percent: createData.Deposit_Percent,
      Deposit_Amount: createData.Deposit_Amount,
    });

    // CREATE
    const newPost = await prisma.propertyPost.create({
      data: createData,
      include: {
        PropertyUnit: true,
        Image: true,
        Video: true,
        Category: true,
      },
    });

    // Auto-create Deposit เมื่อ SALE
    if (isSale) {
      try {
        if (newPost.PropertyUnit?.length > 0) {
          await prisma.deposit.createMany({
            data: newPost.PropertyUnit.map((unit) => ({
              propertyUnitId: unit.id,
              postId: newPost.id,
              Deposit_Amount: depositAmountNum,
              Deposit_Status: "PENDING",
            })),
          });
        } else {
          await prisma.deposit.create({
            data: {
              postId: newPost.id,
              Deposit_Amount: depositAmountNum,
              Deposit_Status: "PENDING",
            },
          });
        }
      } catch (e) {
        console.error("[createpost] deposit create failed, rolling back:", e);
        await prisma.image.deleteMany({
          where: { propertyPostId: newPost.id },
        });
        await prisma.video.deleteMany({ where: { postId: newPost.id } });
        await prisma.propertyPost.delete({ where: { id: newPost.id } });
        return res.status(500).json({ message: "Create deposit failed" });
      }
    }

    return res.status(201).json(newPost);
  } catch (err) {
    console.error("createpost error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* =============== LIST (placeholder) =============== */
export const list = async (_req, res) => {
  try {
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* =============== SEARCH HELPERS =============== */
const addTextQuery = (where, query) => ({
  ...where,
  OR: [
    { Property_Name: { contains: query, mode: "insensitive" } },
    { Description: { contains: query, mode: "insensitive" } },
    { Address: { contains: query, mode: "insensitive" } },
    { Year_Built: { contains: query, mode: "insensitive" } }, // Year_Built เป็น string
  ],
});

const addCategoryFilter = (where, categoryId) => {
  const ids = Array.isArray(categoryId) ? categoryId : [categoryId];
  return { ...where, categoryId: { in: ids } };
};

const handleTextQuery = (where, query) => {
  return {
    ...where,
    OR: [
      { Property_Name: { contains: query, mode: "insensitive" } },
      { Description: { contains: query, mode: "insensitive" } },
      { Address: { contains: query, mode: "insensitive" } },
      { Province: { contains: query, mode: "insensitive" } },
      { District: { contains: query, mode: "insensitive" } },
      { Subdistrict: { contains: query, mode: "insensitive" } },
      { Year_Built: { contains: query, mode: "insensitive" } },
    ],
  };
};

const addLocationFilter = (where, { province, district, subdistrict }) => {
  const f = {};
  if (province) f.Province = { contains: province, mode: "insensitive" };
  if (district) f.District = { contains: district, mode: "insensitive" };
  if (subdistrict)
    f.Subdistrict = { contains: subdistrict, mode: "insensitive" };
  return { ...where, ...f };
};

const addPriceFilter = (where, { minPrice, maxPrice }) => {
  const Price = {};
  if (minPrice != null && minPrice !== "") Price.gte = parseInt(minPrice, 10);
  if (maxPrice != null && maxPrice !== "") Price.lte = parseInt(maxPrice, 10);
  return Object.keys(Price).length ? { ...where, Price } : where;
};

/* =============== SEARCH (public feed with pagination + SORT) =============== */
export const searchFilters = async (req, res) => {
  try {
    const {
      query,
      categoryId,
      province,
      district,
      subdistrict,
      minPrice,
      maxPrice,
      take: takeRaw,
      skip: skipRaw,
      sort: sortRaw, // <— รับค่าจัดเรียง
    } = req.body;

    const take = Math.min(Number(takeRaw) || 20, 100);
    const skip = Math.max(Number(skipRaw) || 0, 0);

    let where = { Status_post: "CONFIRMED" };
    if (query) where = handleTextQuery(where, query);
    if (categoryId) where = addCategoryFilter(where, categoryId);
    if (province || district || subdistrict)
      where = addLocationFilter(where, { province, district, subdistrict });
    if (minPrice || maxPrice)
      where = addPriceFilter(where, { minPrice, maxPrice });

    const sort = String(sortRaw || "latest");
    const orderBy =
      sort === "priceAsc"
        ? { Price: "asc" }
        : sort === "priceDesc"
          ? { Price: "desc" }
          : { createdAt: "desc" }; // latest (ดีฟอลต์)

    const [posts, total] = await prisma.$transaction([
      prisma.propertyPost.findMany({
        where,
        select: {
          id: true,
          Property_Name: true,
          Price: true,
          Province: true,
          District: true,
          Subdistrict: true,
          Category: true,
          Image: { take: 1, select: { url: true, secure_url: true } },
          createdAt: true,
        },
        orderBy,
        take,
        skip,
      }),
      prisma.propertyPost.count({ where }),
    ]);

    res.json({ total, count: posts.length, posts, take, skip });
  } catch (err) {
    console.error("searchFilters error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =============== GET BY CATEGORY =============== */
export const getbycategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const properties = await prisma.propertyPost.findMany({
      where: { categoryId, Status_post: "CONFIRMED" },
      select: {
        id: true,
        Property_Name: true,
        Price: true,
        Province: true,
        Image: { take: 1, select: { url: true, secure_url: true } },
      },
    });
    res.json(properties);
  } catch (err) {
    console.error("getbycategory error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =============== GET SINGLE POST =============== */
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.propertyPost.findUnique({
      where: { id },
      select: {
        id: true,
        floor: true,
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
        Deposit_Percent: true,
        LinkMap: true,
        Price: true,
        Additional_Amenities: true,
        Parking_Space: true,
        Sell_Rent: true,
        Name: true,
        Link_line: true,
        Link_facbook: true,

        user: {
          select: {
            First_name: true,
            Last_name: true,
            image: true,

            Buyer: {
              select: {
                National_ID: true,
                Reg_HouseNo: true,
                Reg_Village: true,
                Reg_Alley: true,
                Reg_Road: true,
                Reg_Subdistrict: true,
                Reg_District: true,
                Reg_Province: true,
              }
            }

          }
        },
        seller: { select: { Status: true } },
        Phone: true,
        Other_related_expenses: true,
        Status_post: true,
        PropertyUnit: { select: { id: true, Unit_Number: true, Status: true } },
        NumberOfUnits: true,
        Video: { select: { url: true, secure_url: true } },
        Link_line: true,
        Link_facbook: true,
      },
    });

    res.json(post);
  } catch (err) {
    console.error("getPost error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =============== REMOVE (ADMIN/OWNER) =============== */
export const removepost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.propertyPost.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const images = await prisma.image.findMany({
      where: { propertyPostId: id },
    });
    const videos = await prisma.video.findMany({ where: { postId: id } });

    const imagePublicIds = images.map((i) => i.public_id).filter(Boolean);
    const videoPublicIds = videos.map((v) => v.public_id).filter(Boolean);

    await Promise.allSettled([
      imagePublicIds.length
        ? cloudinary.api.delete_resources(imagePublicIds)
        : Promise.resolve(),
      videoPublicIds.length
        ? cloudinary.api.delete_resources(videoPublicIds, {
          resource_type: "video",
        })
        : Promise.resolve(),
    ]);

    await prisma.$transaction([
      prisma.deposit.deleteMany({ where: { postId: id } }),
      prisma.image.deleteMany({ where: { propertyPostId: id } }),
      prisma.video.deleteMany({ where: { postId: id } }),
      prisma.propertyPost.delete({ where: { id } }),
    ]);

    res.json({
      message: "Post and related data deleted successfully",
      deletedPost: post,
      deletedImages: images,
      deletedVideos: videos,
    });
  } catch (err) {
    console.error("removepost error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =============== UPDATE (รีเฟรชรูป/วิดีโอด้วยการอัปใหม่) =============== */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.session?.user?.sellerId) {
      return res.status(401).json({ message: "Unauthorized or not a seller" });
    }
    const { sellerId } = req.session.user;

    const existingPost = await prisma.propertyPost.findUnique({
      where: { id },
    });
    if (!existingPost)
      return res.status(404).json({ message: "Post not found" });
    if (existingPost.sellerId !== sellerId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You are not the owner of this post" });
    }

    const allowedFields = [
      "Property_Name",
      "Price",
      "Usable_Area",
      "Land_Size",
      "Bedrooms",
      "Description",
      "Deposit_Amount",
      "Deposit_Percent", // <— allow update
      "LinkMap",
      "Province",
      "District",
      "Subdistrict",
      "Address",
      "Total_Rooms",
      "Year_Built",
      "Nearby_Landmarks",
      "Additional_Amenities",
      "Parking_Space",
      "Sell_Rent",
      "Link_line",
      "Link_facbook",
      "Name",
      "Phone",
      "Bathroom",
      "Other_related_expenses",
      "categoryId",
      "floor",
    ];

    const asInt = [
      "Bedrooms",
      "Bathroom",
      "Total_Rooms",
      "Parking_Space",
      "floor",
    ];
    const asFloat = [
      "Usable_Area",
      "Land_Size",
      "Deposit_Amount",
      "Deposit_Percent", // <— numeric float 0-100
      "Price",
    ];

    const dataToUpdate = {};
    for (const [k, v] of Object.entries(req.body || {})) {
      if (!allowedFields.includes(k)) continue;
      if (v === undefined) continue;

      if (v === "" || v === null) {
        if (k === "Nearby_Landmarks" || k === "Additional_Amenities") {
          dataToUpdate[k] = { set: [] };
        } else if (k === "categoryId") {
          dataToUpdate["Category"] = { disconnect: true };
        } else {
          dataToUpdate[k] = null;
        }
        continue;
      }

      // รองรับ Other_related_expenses เป็น JSON string หรือ array
      if (k === "Other_related_expenses") {
        let arr = v;
        if (typeof v === "string") {
          try {
            arr = JSON.parse(v);
          } catch {
            // fallback: เก็บเป็น array เดี่ยว
            arr = [v];
          }
        }
        dataToUpdate[k] = Array.isArray(arr) ? arr.map(String) : [];
        continue;
      }

      if (asInt.includes(k)) {
        dataToUpdate[k] = toIntOrNull(v);
        continue;
      }
      if (asFloat.includes(k)) {
        let num = toFloatOrNull(v);
        if (k === "Deposit_Percent" && num != null) {
          num = Math.max(0, Math.min(100, num)); // clamp 0-100
        }
        dataToUpdate[k] = num;
        continue;
      }
      if (k === "Nearby_Landmarks") {
        dataToUpdate[k] = { set: toEnumArray(v, ALLOWED_LANDMARKS) };
        continue;
      }
      if (k === "Additional_Amenities") {
        dataToUpdate[k] = { set: toEnumArray(v, ALLOWED_AMENITIES) };
        continue;
      }
      if (k === "categoryId") {
        dataToUpdate["Category"] = { connect: { id: v } };
        continue;
      }

      dataToUpdate[k] = v;
    }

    // === อัปเดตความสัมพันธ์ของ Deposit_Amount เมื่อมี Deposit_Percent แต่ไม่ได้ส่ง Deposit_Amount มาด้วย ===
    if (
      Object.prototype.hasOwnProperty.call(dataToUpdate, "Deposit_Percent") &&
      !Object.prototype.hasOwnProperty.call(dataToUpdate, "Deposit_Amount")
    ) {
      const percent = dataToUpdate.Deposit_Percent; // อาจเป็น null
      const priceIncoming = dataToUpdate.Price; // ราคาใหม่ใน payload (ถ้ามี)
      const priceExisting = existingPost.Price; // ราคาของเดิม
      const price = priceIncoming != null ? priceIncoming : priceExisting;
      if (percent != null && price != null && price > 0) {
        const amount = Math.round(price * (percent / 100) * 100) / 100;
        dataToUpdate.Deposit_Amount = amount;
      }
    }

    // 1) อัปเดตฟิลด์พื้นฐาน
    const updatedPost = await prisma.propertyPost.update({
      where: { id },
      data: dataToUpdate,
    });

    // 2) อัปเดตรูปแบบ replace ทั้งชุด (ลบเก่า-ใส่ใหม่)
    const newImages = filesOf(req.files, "images");
    let imageResult = null;
    if (newImages.length > 0) {
      const oldImages = await prisma.image.findMany({
        where: { propertyPostId: id },
      });
      await Promise.all(
        oldImages.map((img) =>
          img.public_id
            ? cloudinary.uploader.destroy(img.public_id)
            : Promise.resolve()
        )
      );
      await prisma.image.deleteMany({ where: { propertyPostId: id } });

      const normalized = newImages.map(prepareAsset).filter(Boolean);
      imageResult = await prisma.image.createMany({
        data: normalized.map((a) => ({
          url: a.url,
          secure_url: a.secure_url,
          public_id: a.public_id,
          asset_id: a.asset_id,
          propertyPostId: id,
        })),
      });
    }

    // 3) อัปเดตวิดีโอแบบ replace ทั้งชุด
    const newVideos = filesOf(req.files, "videos");
    let videoResult = null;
    if (newVideos.length > 0) {
      const oldVideos = await prisma.video.findMany({ where: { postId: id } });
      await Promise.all(
        oldVideos.map((v) =>
          v.public_id
            ? cloudinary.uploader.destroy(v.public_id, {
              resource_type: "video",
            })
            : Promise.resolve()
        )
      );
      await prisma.video.deleteMany({ where: { postId: id } });

      const normalizedV = newVideos.map(prepareAsset).filter(Boolean);
      videoResult = await prisma.video.createMany({
        data: normalizedV.map((a) => ({
          url: a.url,
          secure_url: a.secure_url,
          public_id: a.public_id,
          asset_id: a.asset_id,
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
    console.error("updatePost error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =============== CATEGORIES =============== */
export const getallcategory = async (_req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error in getallcategory:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =============== HOMEPAGE FEED (personalized ordering + SORT) =============== */
export const getHomePagePosts = async (req, res) => {
  try {
    const userFromSession = req.session?.user;
    const userId = userFromSession ? userFromSession.userId : null;

    const sortRaw = String(req.query.sort || "preferred"); // default = preferred
    const sort = ["preferred", "latest", "priceAsc", "priceDesc"].includes(
      sortRaw
    )
      ? sortRaw
      : "preferred";

    const take = Math.min(Number(req.query.take) || 100, 100);
    const skip = Math.max(Number(req.query.skip) || 0, 0);

    // ถ้าไม่ใช่ preferred → ให้ DB order ให้เลย
    if (sort !== "preferred") {
      const orderBy =
        sort === "priceAsc"
          ? { Price: "asc" }
          : sort === "priceDesc"
            ? { Price: "desc" }
            : { createdAt: "desc" }; // latest

      const posts = await prisma.propertyPost.findMany({
        where: { Status_post: "CONFIRMED" },
        select: {
          id: true,
          Province: true,
          District: true,
          Subdistrict: true,
          Property_Name: true,
          Price: true,
          Image: { take: 1, select: { secure_url: true, url: true } },
          Nearby_Landmarks: true,
          Additional_Amenities: true,
          createdAt: true,
        },
        orderBy,
        take,
        skip,
      });
      return res.json(posts);
    }

    // ===== sort = preferred =====
    // ต้องมีพรีเฟอเรนซ์จากผู้ใช้
    let buyerPreferences = null;
    if (userId) {
      buyerPreferences = await prisma.buyer.findUnique({
        where: { userId },
        select: {
          Preferred_Province: true,
          Preferred_District: true,
          Preferred_Subdistrict: true,
          Nearby_Facilities: true, // enum เดี่ยว
          Lifestyle_Preferences: true, // enum เดี่ยว
        },
      });
    }

    // ถ้าไม่มีโปรไฟล์ → fallback เป็นล่าสุด
    if (!buyerPreferences) {
      const posts = await prisma.propertyPost.findMany({
        where: { Status_post: "CONFIRMED" },
        select: {
          id: true,
          Province: true,
          District: true,
          Subdistrict: true,
          Property_Name: true,
          Price: true,
          Image: { take: 1, select: { secure_url: true, url: true } },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take,
        skip,
      });
      return res.json(posts);
    }

    // ดึงก้อนใหญ่ก่อน แล้ว sort ด้วยคะแนน
    const allPosts = await prisma.propertyPost.findMany({
      where: { Status_post: "CONFIRMED" },
      select: {
        id: true,

        Deposit_Amount: true,// สำหรับ 'deposit'
        Usable_Area: true,  // สำหรับ 'size'
        Bedrooms: true,  // สำหรับ 'badroom'
        Bathroom: true,   // สำหรับ 'bathroom'
        Category: {
          select: {
            name: true
          }
        },
        categoryId: true,
        Province: true,
        District: true,
        Subdistrict: true,
        Property_Name: true,
        Price: true,
        Image: { take: 1, select: { secure_url: true, url: true } },
        Nearby_Landmarks: true,
        Additional_Amenities: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }, // ใช้เป็น tie-breaker
      take: 500,
    });

    const score = (post, prefs) => {
      let s = 0;
      if (post.Province === prefs.Preferred_Province) {
        s += 10;
        if (post.District === prefs.Preferred_District) {
          s += 5;
          if (post.Subdistrict === prefs.Preferred_Subdistrict) s += 3;
        }
      }
      if (prefs.Nearby_Facilities && post.Nearby_Landmarks) {
        const hit = post.Nearby_Landmarks.some(
          (f) => f === prefs.Nearby_Facilities
        );
        if (hit) s += 2;
      }
      if (prefs.Lifestyle_Preferences && post.Additional_Amenities) {
        const hit2 = post.Additional_Amenities.some(
          (a) => a === prefs.Lifestyle_Preferences
        );
        if (hit2) s += 1;
      }
      return s;
    };

    const sorted = allPosts.sort(
      (a, b) => score(b, buyerPreferences) - score(a, buyerPreferences)
    );

    const sliced = sorted.slice(skip, skip + take);
    return res.json(sliced);
  } catch (err) {
    console.error("getHomePagePosts error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getallNamepropertyPost = async (req, res) => {
  try {
    const posts = await prisma.propertyPost.findMany({
      where: {
        Status_post: "CONFIRMED",
      },
      select: {
        id: true,
        Property_Name: true,
      },
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching property post names:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
