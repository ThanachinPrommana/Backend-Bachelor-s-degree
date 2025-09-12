// controllers/notification.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/** เปรียบเทียบ owner แบบทนทาน (cast เป็น string ทั้งคู่) */
function assertOwnerOrThrow(reqUserId, targetUserId) {
  const A = reqUserId != null ? String(reqUserId) : "";
  const B = targetUserId != null ? String(targetUserId) : "";
  if (!A || !B || A !== B) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
}

/**
 * GET /user/notification/:userId
 * Query: ?limit=5 | ?status=UNREAD|READ | ?type=... | ?page=1&pageSize=50
 */
exports.getuserNotifications = async (req, res) => {
  try {
    const { userId: paramUserId } = req.params;
    const {
      limit,
      status, // UNREAD | READ | all
      type,   // deposit | post | document | system | all
      page = 1,
      pageSize = 50,
    } = req.query;

    // ใช้ req.user.id เป็นแหล่งความจริง
    const me = req.user?.id ? String(req.user.id) : "";
    const target = paramUserId ? String(paramUserId) : me;

    // ความปลอดภัย: user ต้องดึงของตนเองเท่านั้น
    assertOwnerOrThrow(me, target);

    const where = { userId: target };
    if (status && status !== "all") where.Status = status; // prisma enum
    if (type && type !== "all") where.type = type;

    const take = limit ? Number(limit) : Number(pageSize);
    const skip = limit ? 0 : (Number(page) - 1) * take;

    const [rows, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.notification.count({ where }),
    ]);

    // ให้ FE ใช้ฟิลด์ lowercase เสมอ (fallback สำหรับ schema เดิม)
    const notifications = rows.map((n) => ({
      id: n.id,
      userId: n.userId,
      title: n.title ?? n.Title ?? "แจ้งเตือน",
      message: n.message ?? n.Message ?? "",
      type: n.type ?? "general",
      status: n.status ?? n.Status ?? "UNREAD",
      targetUrl: n.targetUrl ?? null,
      relatedProcess: n.relatedProcess ?? null,
      createdAt: n.createdAt,
      readAt: n.readAt ?? null,
    }));

    res.json({ notifications, total });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server Error" });
  }
};

/** PATCH /user/notification/:notiId/read */
exports.markAsRead = async (req, res) => {
  try {
    const { notiId } = req.params;

    const noti = await prisma.notification.findUnique({ where: { id: notiId } });
    if (!noti) return res.status(404).json({ message: "Notification not found" });

    // เจ้าของเท่านั้น
    assertOwnerOrThrow(req.user?.id, noti.userId);

    const updated = await prisma.notification.update({
      where: { id: notiId },
      data: { Status: "READ", readAt: new Date() },
    });

    res.json({
      id: updated.id,
      title: updated.title ?? updated.Title ?? "",
      message: updated.message ?? updated.Message ?? "",
      status: updated.Status ?? "READ",
      readAt: updated.readAt ?? null,
    });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server Error" });
  }
};

/** DELETE /user/remove/noti/:notiId */
exports.removeNotification = async (req, res) => {
  try {
    const { notiId } = req.params;

    const noti = await prisma.notification.findUnique({ where: { id: notiId } });
    if (!noti) return res.status(404).json({ message: "Notification not found" });

    // เจ้าของเท่านั้น
    assertOwnerOrThrow(req.user?.id, noti.userId);

    await prisma.notification.delete({ where: { id: notiId } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server Error" });
  }
};

/** DELETE /user/removeAll/noti */
exports.removeNotiAll = async (req, res) => {
  try {
    const me = req.user?.id ? String(req.user.id) : "";
    if (!me) return res.status(401).json({ message: "Unauthorized" });

    await prisma.notification.deleteMany({ where: { userId: me } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Server Error" });
  }
};

/** Helper สำหรับ trigger แจ้งเตือนจาก event อื่น */
exports.createNotification = async ({
  userId,
  title,
  message,
  type = "general",
  targetUrl = null,
  relatedProcess = null,
  status = "UNREAD",
}) => {
  return prisma.notification.create({
    data: {
      userId,
      // รองรับทั้ง schema เก่า/ใหม่: Prisma จะแมพตามคอลัมน์ที่มีจริง
      title, Title: title,
      message, Message: message,
      type,
      targetUrl,
      relatedProcess,
      Status: status,
    },
  });
};
