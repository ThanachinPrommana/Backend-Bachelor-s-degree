import prisma from "../config/prisma.js";

/** helper: ทำชื่อให้สะอาด/มาตรฐาน */
const normalizeName = (raw) =>
  raw
    ?.toString()
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

export const create = async (req, res) => {
  try {
    const raw = req.body?.name;
    if (typeof raw !== "string" || !raw.trim()) {
      return res.status(400).json({ message: "name is required" });
    }

    const name = normalizeName(raw);

    // ถ้าอยากกันชื่อซ้ำแบบ case-insensitive (แนะนำให้ทำ)
    const exists = await prisma.category.findFirst({
      where: { name },
      select: { id: true },
    });
    if (exists) {
      return res.status(409).json({ message: "Category name already exists" });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    // ใช้ 201 Created
    return res.status(201).json(category);
  } catch (err) {
    console.error("create category error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const list = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" }, // ให้ผลลัพธ์คงที่/อ่านง่าย
      select: { id: true, name: true },
    });
    return res.json(categories);
  } catch (err) {
    console.error("list category error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const cat = await prisma.category.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!cat) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json(cat);
  } catch (err) {
    console.error("getById category error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const removecategory = async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    await prisma.category.delete({
      where: { id },
    });

    // 204 No Content ก็ได้ แต่คง message แบบเดิมไว้
    return res.status(200).json({ message: "Delete Success" });
  } catch (err) {
    console.error("remove category error:", err);

    // ไม่พบ (ใน Prisma v5+ ลบไม่เจอจะโยน P2025)
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Category not found" });
    }

    // ลบไม่ได้เพราะมี FK ผูกกับ PropertyPost อยู่
    if (err.code === "P2003") {
      return res.status(409).json({
        message:
          "Cannot delete category because it is referenced by other records (e.g., property posts).",
      });
    }

    return res.status(500).json({ message: "Server Error" });
  }
};
