// controllers/notification.js (merged & reconciled, ESM)

import prisma from "../config/prisma.js"; // ใช้ตัวเดียวกับทั้งโปรเจกต์

/** ช่วยดึง user id จาก req.user (auth middleware) หรือจาก session (fallback) */
function getAuthUserId(req) {
  const a =
    req.user?.id ??
    req.session?.user?.userId ??
    req.session?.user?.id ??
    null;
  return a != null ? String(a) : "";
}

/** เปรียบเทียบ owner แบบทนทาน (cast เป็น string ทั้งคู่) */
function assertOwnerOrThrow(reqUserId, targetUserId) {
  const A = reqUserId ? String(reqUserId) : "";
  const B = targetUserId ? String(targetUserId) : "";
  if (!A || !B || A !== B) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
}

/**
 * GET /user/notification/:userId?
 * Query:
 *   - limit=5 | page=1&pageSize=50
 *   - status=UNREAD|READ|all
 *   - type=deposit|post|document|system|general|all
 *   - relatedProcess=DOCUMENT_UPLOAD|DOCUMENT_APPROVAL|DOCUMENT_REJECTION|...|all
 *
 * หมายเหตุ:
 * - ถ้าไม่ส่ง :userId มาจะดึงของตัวเองจาก token/session
 * - รวม logic กรอง relatedProcess แบบไฟล์ที่จะ merge
 * - มี pagination + normalize fields แบบของเดิม
 * - ✅ เพิ่ม cookie hint (unreadCount/lastUpdated) สำหรับ FE อ่านเร็ว ๆ
 */
export const getuserNotifications = async (req, res) => {
  try {
    const me = getAuthUserId(req);
    if (!me) return res.status(401).json({ message: "Unauthorized" });

    const { userId: paramUserId } = req.params;
    const target = paramUserId ? String(paramUserId) : me;

    // ป้องกันดึงของคนอื่น
    assertOwnerOrThrow(me, target);

    const {
      limit,
      page = 1,
      pageSize = 50,
      status,          // UNREAD | READ | all
      type,            // deposit | post | document | system | general | all
      relatedProcess,  // DOCUMENT_UPLOAD | ... | all
    } = req.query;

    const where = { userId: target };
    if (status && status !== "all") where.Status = status;
    if (type && type !== "all") where.type = type;
    if (relatedProcess && relatedProcess !== "all") where.relatedProcess = relatedProcess;

    const take = Math.max(1, Number(limit ?? pageSize) || 50);
    const skip = limit ? 0 : (Math.max(1, Number(page) || 1) - 1) * take;

    const [rows, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.notification.count({ where }),
    ]);

    // normalize fields รองรับ schema เก่า/ใหม่ (ฝั่ง response เท่านั้น)
    const notifications = rows.map((n) => ({
      id: n.id,
      userId: n.userId,
      title: n.Title ?? n.title ?? "แจ้งเตือน",
      message: n.Message ?? n.message ?? "",
      type: n.type ?? "general",
      status: n.Status ?? n.status ?? "UNREAD",
      targetUrl: n.targetUrl ?? null,
      relatedProcess: n.relatedProcess ?? null,
      referenceId: n.referenceId ?? null,
      createdAt: n.createdAt,
      readAt: n.readAt ?? null,
    }));

    // ✅ คำนวณค่า hint สำหรับคุกกี้
    const unreadCount = rows.reduce(
      (acc, n) => acc + ((n.Status ?? n.status) === "UNREAD" ? 1 : 0),
      0
    );
    const lastUpdated = (rows[0]?.createdAt ?? new Date()).toISOString();

    // ✅ เขียนคุกกี้ noti_hint (FE อ่านได้ → httpOnly: false)
    // หมายเหตุ:
    // - dev: ใช้ sameSite=Lax + secure=false ก็พอ
    // - cross-subdomain/prod: ใช้ sameSite=None + secure=true และอาจตั้ง domain
    const sameSite = (process.env.COOKIE_SAMESITE || "Lax");
    res.cookie("noti_hint", encodeURIComponent(JSON.stringify({ unreadCount, lastUpdated })), {
      httpOnly: false,
      sameSite,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 5 * 60 * 1000, // 5 นาทีเป็น hint
      // domain: process.env.COOKIE_DOMAIN || undefined, // ตั้งถ้าข้ามซับโดเมนจริง
    });

    return res.json({
      notifications,
      total,
      page: Number(page) || 1,
      pageSize: take,
      unreadCount,
      lastUpdated,
    });
  } catch (err) {
    console.error("getuserNotifications error:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Server Error" });
  }
};

/** PATCH /user/notification/:notiId/read */
export const markAsRead = async (req, res) => {
  try {
    const me = getAuthUserId(req);
    if (!me) return res.status(401).json({ message: "Unauthorized" });

    const { notiId } = req.params;
    const noti = await prisma.notification.findUnique({ where: { id: notiId } });
    if (!noti) return res.status(404).json({ message: "Notification not found" });

    // เจ้าของเท่านั้น
    assertOwnerOrThrow(me, noti.userId);

    const updated = await prisma.notification.update({
      where: { id: notiId },
      data: { Status: "READ", readAt: new Date() },
    });

    res.json({
      id: updated.id,
      title: updated.Title ?? "",
      message: updated.Message ?? "",
      status: updated.Status ?? "READ",
      readAt: updated.readAt ?? null,
    });
  } catch (err) {
    console.error("markAsRead error:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Server Error" });
  }
};

/** DELETE /user/remove/noti/:notiId */
export const removeNotification = async (req, res) => {
  try {
    const me = getAuthUserId(req);
    if (!me) return res.status(401).json({ message: "Unauthorized" });

    const { notiId } = req.params;
    const noti = await prisma.notification.findUnique({ where: { id: notiId } });
    if (!noti) return res.status(404).json({ message: "Notification not found" });

    // เจ้าของเท่านั้น
    assertOwnerOrThrow(me, noti.userId);

    await prisma.notification.delete({ where: { id: notiId } });
    res.json({ success: true });
  } catch (err) {
    console.error("removeNotification error:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Server Error" });
  }
};

/** DELETE /user/removeAll/noti */
export const removeNotiAll = async (req, res) => {
  try {
    const me = getAuthUserId(req);
    if (!me) return res.status(401).json({ message: "Unauthorized" });

    const { count } = await prisma.notification.deleteMany({
      where: { userId: me },
    });
    res.json({ success: true, deleted: count });
  } catch (err) {
    console.error("removeNotiAll error:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Server Error" });
  }
};

/** Helper สำหรับ trigger แจ้งเตือนจาก event อื่น */
export const createNotification = async ({
  userId,
  title,
  message,
  type = "general",
  targetUrl = null,
  relatedProcess = null,
  referenceId = null,
  status = "UNREAD",
}) => {
  // สำคัญ: Prisma จะ error ถ้าใส่ฟิลด์ที่ไม่อยู่ใน model
  return prisma.notification.create({
    data: {
      userId,
      Title: title,
      Message: message,
      type,
      targetUrl,
      relatedProcess,
      referenceId,
      Status: status,
    },
  });
};
