// controllers/post.merged.js (merged & optimized)
import prisma from "../config/prisma.js";
import cloudinary from "../utils/cloudinary.js";
import {
  toIntOrNull,
  toFloatOrNull,
  toEnumArray,
  filesOf,
  connectIf,
} from "../utils/parse.js";

// ===== Allowed enums (must match schema.prisma) =====
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

// =============== CREATE (Create Post + initial Deposit + optional PropertyUnits) ===============
export const createpost = async (req, res) => {
  try {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized, please login first" });
    }

    const { userId, userType, sellerId } = req.session.user || {};

    // Fallback: if Seller but sellerId missing in session, fetch from DB
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
      // Propertytype, // ❌ not in schema (kept out intentionally)
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

    // Files (multer.fields / multer.array supported)
    const imageFiles = filesOf(req.files, "images");
    const videoFiles = filesOf(req.files, "videos");

    // Parse propertyUnits (stringified JSON or array)
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
            // Propertytype, // ❌ excluded
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
                  })),
                },
              }),

            ...(connectIf(categoryId)
              ? { Category: connectIf(categoryId) }
              : {}),

            user: { connect: { id: userId } },
            seller: { connect: { id: effectiveSellerId } },

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

        // Create an initial Deposit record for the post itself (no buyer)
        await tx.deposit.create({
          data: {
            postId: newPost.id,
            Deposit_Amount: toFloatOrNull(Deposit_Amount),
            Deposit_Status: "PENDING",
          },
        });

        return newPost;
      },
      { timeout: 10000 }
    );

    return res.status(201).json(newPostWithDeposit);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// =============== LIST (placeholder) ===============
export const list = async (req, res) => {
  try {
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const handlePrice = async (req, res, price) => {
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

export const handleSellerRent = async (req, res) => {
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

export const searchFilters = async (req, res) => {
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

// =============== REMOVE (ADMIN/OWNER) ===============
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

    // Delete cloud assets in parallel (faster)
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =============== UPDATE (supports media refresh) ===============
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
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.sellerId !== sellerId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You are not the owner of this post" });
    }

    // Allowed fields (Propertytype excluded to match schema)
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
      // "Propertytype", // ❌ not in schema
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

    // ==== Media update (only if new files provided) ====
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
