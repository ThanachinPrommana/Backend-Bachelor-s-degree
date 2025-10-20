// controllers/post.js (merged, safe with current schema)
import { create } from "domain";
import prisma from "../config/prisma.js";
import cloudinary from "../utils/cloudinary.js";
import {
  toIntOrNull,
  toFloatOrNull,
  toEnumArray,
  filesOf,
  connectIf,
} from "../utils/parse.js";
const uploadWithAssetId = async (file, folder = "property_assets") => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder,
    resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
  })
  console.log('Cloudinary result:', result);
  return {
    asset_id: result.asset_id,
    public_id: result.public_id,
    url: result.url,
    secure_url: result.secure_url,
  };
}

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

/* =============== CREATE (Post + initial Deposit + optional Units) =============== */
export const createpost = async (req, res) => {
  try {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized, please login first" });
    }

    const { userId, userType, sellerId } = req.session.user || {};

    // Fallback: ถ้าเป็น Seller แต่ session ไม่มี sellerId ให้ค้นจาก DB
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
      // Propertytype, // ❌ not in schema
      Other_related_expenses,
      categoryId,
      Interest,
      floor,
      propertyUnits, // optional array or JSON string
    } = req.body;

    if (!Deposit_Amount || Number(Deposit_Amount) <= 0) {
      return res
        .status(400)
        .json({ message: "This post requires a valid deposit amount." });
    }

    // รองรับทั้ง multer.fields() และ multer.array()
    const imageFiles = filesOf(req.files, "images");
    const videoFiles = filesOf(req.files, "videos");

    const imageData = await Promise.all(
      imageFiles.map((file) => uploadWithAssetId(file, 'property_images'))
    );

    const videoData = await Promise.all(
      videoFiles.map((file) => uploadWithAssetId(file, 'property_videos'))
    );
    // parse propertyUnits (stringified JSON หรือ array)
    let parsedPropertyUnits = [];
    if (typeof propertyUnits === "string" && propertyUnits.length > 0) {
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

    const newPostWithDeposit = await prisma.$transaction(
      async (tx) => {
        const newPost = await tx.propertyPost.create({
          data: {
            Property_Name,
            Province,
            District,
            Subdistrict,
            Address,
            Description,
            Usable_Area: toFloatOrNull(Usable_Area),
            Land_Size: toFloatOrNull(Land_Size),
            Bedrooms: toIntOrNull(Bedrooms),
            Bathroom: toIntOrNull(Bathroom),
            Total_Rooms: toIntOrNull(Total_Rooms),
            Year_Built, // string per schema

            Nearby_Landmarks: toEnumArray(Nearby_Landmarks, ALLOWED_LANDMARKS),
            Additional_Amenities: toEnumArray(
              Additional_Amenities,
              ALLOWED_AMENITIES
            ),

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

            NumberOfUnits:
              parsedPropertyUnits && parsedPropertyUnits.length > 0
                ? parsedPropertyUnits.length
                : 1,

            ...(parsedPropertyUnits &&
              parsedPropertyUnits.length > 0 && {
              PropertyUnit: {
                create: parsedPropertyUnits.map((unit) => ({
                  Unit_Number: unit.Unit_Number,
                  // Deposit: {
                  //   create: {
                  //     Deposit_Amount: toFloatOrNull(Deposit_Amount), // ใช้ค่ามัดจำจาก req.body
                  //     Deposit_Status: "PENDING",
                  //   }
                  // }
                })),
              },
            }),

            ...(connectIf(categoryId)
              ? { Category: connectIf(categoryId) }
              : {}),

            user: { connect: { id: userId } },
            seller: { connect: { id: effectiveSellerId } },

            Image: {
              create: imageData
              // create: imageFiles.map((file) => ({
              //   asset_id: file.asset_id,
              //   public_id: file.public_id || file.filename,
              //   url: file.path || file.url,
              //   secure_url: file.secure_url || file.path || file.url,
              // })),
            },
            Video: {
              create: videoData
              // create: videoFiles.map((file) => ({
              //   asset_id: file.asset_id,
              //   public_id: file.public_id || file.filename,
              //   url: file.path || file.url,
              //   secure_url: file.secure_url || file.path || file.url,
              // })),
            },
          },
          include: { Image: true, Video: true, PropertyUnit: true, },

        });

        // Initial Deposit (ยังไม่ผูกกับผู้ซื้อ)
        // await tx.deposit.create({
        //   data: {
        //     postId: newPost.id,
        //     Deposit_Amount: toFloatOrNull(Deposit_Amount),
        //     Deposit_Status: "PENDING",
        //   },
        // });
        // ขั้นตอนที่ 2: สร้าง Deposit สำหรับแต่ละ Unit ที่เพิ่งสร้างไป
        // เราจะใช้ newPost.PropertyUnit ที่ได้มาจาก include ในขั้นตอนที่ 1
        if (newPost.PropertyUnit && newPost.PropertyUnit.length > 0) {
          // สร้าง list ของ data ที่จะใช้สร้าง Deposit
          const depositData = newPost.PropertyUnit.map(unit => ({
            propertyUnitId: unit.id,          //  <-- ID ของยูนิต
            postId: newPost.id,               //  <-- ID ของโพสต์แม่
            Deposit_Amount: toFloatOrNull(Deposit_Amount),
            Deposit_Status: "PENDING",
          }));

          // สร้าง Deposit ทั้งหมดในครั้งเดียวเพื่อประสิทธิภาพที่ดีกว่า
          await tx.deposit.createMany({
            data: depositData,
          });
        }

        return newPost;
      },
      { timeout: 20000 }
    );

    return res.status(201).json(newPostWithDeposit);
  } catch (err) {
    console.error("createpost error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* =============== LIST (placeholder) =============== */
export const list = async (req, res) => {
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

// =============== SEARCH HELPERS ===============
const handleTextQuery = (where, query) => {
  return {
    ...where,
    OR: [
      { Property_Name: { contains: query, mode: "insensitive" } },
      { Description: { contains: query, mode: "insensitive" } },
      { Address: { contains: query, mode: "insensitive" } },
      { Province: { continue: query, mode: "insensitive" } },
      { District: { continue: query, mode: "insensitive" } },
      { Subdistrict: { continue: query, mode: "insensitive" } },
      { Address: { continue: query, mode: "insensitive" } },
      { Year_Built: { continue: query, mode: "insensitive" } },
      // เพิ่ม Year_Built ถ้าต้องการค้นหาด้วย แต่ต้องแน่ใจว่า Type เป็น String
      // { Year_Built: { contains: query, mode: "insensitive" } }, 
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

/* =============== SEARCH (public feed with pagination) =============== */
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
        orderBy: { createdAt: "desc" },
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
        Image: { take: 1, select: { url: true } },
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
            image: true,

          }
        },
        seller: {
          select: {
            Status: true
          }
        },
        Phone: true,
        Latitude: true,
        Longitude: true,
        Other_related_expenses: true,
        Status_post: true,
        PropertyUnit: {
          select: {
            id: true,
            Unit_Number: true,
            Status: true
          }
        },
        NumberOfUnits: true,
        Video: { select: { url: true, secure_url: true } },
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

    // ลบทรัพยากรบน Cloudinary แบบขนาน
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

/* =============== UPDATE (รองรับ refresh รูป/วิดีโอ) =============== */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.session.user || !req.session.user.sellerId) {
      return res.status(401).json({ message: "Unauthorized or not a seller" });
    }
    const { sellerId } = req.session.user;

    if (!req.body || typeof req.body !== "object") {
      return res
        .status(400)
        .json({ message: "Invalid or missing request body" });
    }

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

    // ❗ Propertytype ถูกตัดออก (ไม่มีใน schema)
    const allowedFields = [
      "Property_Name",
      "Price",
      "Usable_Area",
      "Land_Size",
      "Bedrooms",
      "Description",
      "Deposit_Amount",
      "Contract_Seller",
      "LinkMap",
      "Latitude",
      "Longitude",
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
      "Interest",
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
      "Price",
      "Latitude",
      "Longitude",
      "Interest",
    ];

    const dataToUpdate = {};
    for (const [k, v] of Object.entries(req.body)) {
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

      if (asInt.includes(k)) {
        dataToUpdate[k] = toIntOrNull(v);
        continue;
      }
      if (asFloat.includes(k)) {
        dataToUpdate[k] = toFloatOrNull(v);
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

    const updatedPost = await prisma.propertyPost.update({
      where: { id },
      data: dataToUpdate,
    });

    // ===== อัปเดตรูป =====
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

    // ===== อัปเดตวิดีโอ =====
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
    console.error("updatePost error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =============== CATEGORIES =============== */
export const getallcategory = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error in getallcategory:", err);
    res.status(500).json({ message: "Failed to retrieve categories." });
  }
};

/* =============== HOMEPAGE FEED (personalized ordering) =============== */
export const getHomePagePosts = async (req, res) => {
  try {
    const userFromSession = req.session.user;
    const userId = userFromSession ? userFromSession.userId : null;
    let buyerPreferences = null;

    if (userId) {
      buyerPreferences = await prisma.buyer.findUnique({
        where: { userId },
        select: {
          Preferred_Province: true,
          Preferred_District: true,
          Preferred_Subdistrict: true, // ดึงข้อมูลส่วนนี้มาแล้ว
          Nearby_Facilities: true,
          Lifestyle_Preferences: true
        }
      });
    }

    const allPosts = await prisma.propertyPost.findMany({
      where: { Status_post: "CONFIRMED" },
      select: {
        id: true,
        Province: true,
        District: true,
        Subdistrict: true, // ดึงข้อมูลส่วนนี้มาแล้ว
        Property_Name: true,
        Price: true,
        Image: { take: 1, select: { secure_url: true } },
        Nearby_Landmarks: true,
        Additional_Amenities: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    if (!buyerPreferences) {
      return res.json(allPosts);
    }

    const calculateMatchScore = (post, prefs) => {
      let score = 0;

      // 1. ตรวจสอบจังหวัด, อำเภอ, และตำบล
      if (post.Province === prefs.Preferred_Province) {
        score += 10; // จังหวัดตรงกัน +10 คะแนน
        if (post.District === prefs.Preferred_District) {
          score += 5; // อำเภอตรงกัน +5 คะแนน
          // (เพิ่ม) ตรวจสอบตำบล/แขวง
          if (post.Subdistrict === prefs.Preferred_Subdistrict) {
            score += 3; // ตำบล/แขวงตรงกัน +3 คะแนน
          }
        }
      }

      // 2. ตรวจสอบสิ่งอำนวยความสะดวกใกล้เคียง
      if (prefs.Nearby_Facilities && post.Nearby_Landmarks) {
        const matchingFacilities = post.Nearby_Landmarks.filter(facility =>
          prefs.Nearby_Facilities.includes(facility)
        );
        score += matchingFacilities.length * 2;
      }

      // 3. ตรวจสอบไลฟ์สไตล์
      if (prefs.Lifestyle_Preferences && post.Additional_Amenities) {
        const matchingAmenities = post.Additional_Amenities.filter(amenity =>
          prefs.Lifestyle_Preferences.includes(amenity)
        );
        score += matchingAmenities.length;
      }

      return score;
    };

    allPosts.sort((postA, postB) => {
      const scoreA = calculateMatchScore(postA, buyerPreferences);
      const scoreB = calculateMatchScore(postB, buyerPreferences);
      return scoreB - scoreA;
    });

    res.json(allPosts);
  } catch (err) {
    console.error("getHomePagePosts error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getallNamepropertyPost = async (req, res) => {
  try {
    const posts = await prisma.propertyPost.findMany({
      select: {
        id: true,
        Property_Name: true
      }

    })
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching property post names:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}