import prisma from "../config/prisma.js";

export const getAvailableSlotsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    // 1) ตรวจว่ามีโพสต์นี้จริงไหม
    const post = await prisma.propertyPost.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 2) ตัวเลือก pagination เบื้องต้น ?page, ?limit
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    // 3) ดึงเฉพาะ slot ที่ยังว่าง และยังเป็นอนาคต
    const now = new Date();
    const [items, total] = await Promise.all([
      prisma.dateTimeSlot.findMany({
        where: {
          postId,
          isBooked: false,
          startTime: { gt: now }, // เฉพาะอนาคต
        },
        orderBy: { startTime: "asc" },
        skip,
        take: limit,
        select: {
          id: true,
          startTime: true,
          endTime: true,
          isBooked: true,
          sellerId: true,
          postId: true,
        },
      }),
      prisma.dateTimeSlot.count({
        where: { postId, isBooked: false, startTime: { gt: now } },
      }),
    ]);

    return res.status(200).json({
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching available slots:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};
