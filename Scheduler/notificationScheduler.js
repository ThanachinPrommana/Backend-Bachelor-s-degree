// Scheduler/notificationScheduler.js  (ESM + named exports)

import cron from "node-cron";
import prisma from "../config/prisma.js";

// ========== 1) Reminders: แจ้ง "พรุ่งนี้" ==========
async function checkAndSendReminders() {
  console.log("⏰ [Scheduler] Checking TOMORROW appointments...");
  const now = new Date();
  const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const endOfTomorrow   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);

  try {
    const upcoming = await prisma.booking.findMany({
      where: {
        isReminderSent: false,
        dateTimeSlot: { startTime: { gte: startOfTomorrow, lte: endOfTomorrow } },
      },
      include: {
        Buyer:  { include: { user: true } },
        Seller: { include: { user: true } },
        dateTimeSlot: true,
      },
    });

    if (upcoming.length === 0) {
      console.log("✅ [Scheduler] No reminders to send for tomorrow.");
      return;
    }

    const notifications = upcoming.flatMap((b) => [
      {
        userId: b.Buyer.userId,
        referenceId: b.id,
        Title: "แจ้งเตือนนัดหมายวันพรุ่งนี้",
        Message: `คุณมีนัดหมายกับ ${b.Seller.user.First_name} ในวันพรุ่งนี้ เวลา ${b.dateTimeSlot.startTime.toLocaleTimeString("th-TH")} น.`,
        Status: "UNREAD",
        relatedProcess: "APPOINTMENT_REMINDER",
      },
      {
        userId: b.Seller.userId,
        referenceId: b.id,
        Title: "แจ้งเตือนนัดหมายวันพรุ่งนี้",
        Message: `คุณมีนัดหมายกับ ${b.Buyer.user.First_name} ในวันพรุ่งนี้ เวลา ${b.dateTimeSlot.startTime.toLocaleTimeString("th-TH")} น.`,
        Status: "UNREAD",
        relatedProcess: "APPOINTMENT_REMINDER",
      },
    ]);

    await prisma.$transaction([
      prisma.notification.createMany({ data: notifications }),
      prisma.booking.updateMany({
        where: { id: { in: upcoming.map((x) => x.id) } },
        data: { isReminderSent: true },
      }),
    ]);

    console.log(`🚀 [Scheduler] Sent ${notifications.length} reminder notifications.`);
  } catch (err) {
    console.error("[Scheduler] Reminders error:", err);
  }
}

// ========== 2) Day-of Alerts: แจ้ง "วันนี้" ==========
async function checkAndSendDayOfAlerts() {
  console.log("[Scheduler] Checking TODAY appointments...");
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfToday   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  try {
    const today = await prisma.booking.findMany({
      where: {
        isDayOfAlertSent: false,
        dateTimeSlot: { startTime: { gte: startOfToday, lte: endOfToday } },
      },
      include: {
        Buyer:  { include: { user: true } },
        Seller: { include: { user: true } },
        dateTimeSlot: true,
      },
    });

    if (today.length === 0) {
      console.log("✅ [Scheduler] No day-of alerts to send.");
      return;
    }

    const notifications = today.flatMap((b) => [
      {
        userId: b.Buyer.userId,
        referenceId: b.id,
        Title: "การนัดหมายของคุณคือวันนี้!",
        Message: `อย่าลืม! วันนี้คุณมีนัดหมายกับ ${b.Seller.user.First_name} เวลา ${b.dateTimeSlot.startTime.toLocaleTimeString("th-TH")} น.`,
        Status: "UNREAD",
        relatedProcess: "APPOINTMENT_ALERT",
      },
      {
        userId: b.Seller.userId,
        referenceId: b.id,
        Title: "การนัดหมายของคุณคือวันนี้!",
        Message: `อย่าลืม! วันนี้คุณมีนัดหมายกับ ${b.Buyer.user.First_name} เวลา ${b.dateTimeSlot.startTime.toLocaleTimeString("th-TH")} น.`,
        Status: "UNREAD",
        relatedProcess: "APPOINTMENT_ALERT",
      },
    ]);

    await prisma.$transaction([
      prisma.notification.createMany({ data: notifications }),
      prisma.booking.updateMany({
        where: { id: { in: today.map((x) => x.id) } },
        data: { isDayOfAlertSent: true },
      }),
    ]);

    console.log(`🚀 [Scheduler] Sent ${notifications.length} day-of notifications.`);
  } catch (err) {
    console.error("[Scheduler] Day-of alerts error:", err);
  }
}

// ========== 3) At-time Alerts: แจ้งเมื่อ "ถึงเวลา" ==========
async function checkAndSendAtTimeAlerts() {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  try {
    const due = await prisma.booking.findMany({
      where: {
        isAtTimeAlertSent: false,
        bookingStatus: "CONFIRMED",
        dateTimeSlot: { startTime: { gte: fiveMinutesAgo, lte: now } },
      },
      include: {
        Buyer:  { include: { user: true } },
        Seller: { include: { user: true } },
        dateTimeSlot: true,
      },
    });

    if (due.length === 0) return;

    console.log(`🔥 [Scheduler] ${due.length} appointments due now. Sending at-time alerts...`);

    const notifications = due.flatMap((b) => {
      const t = b.dateTimeSlot.startTime.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
      return [
        {
          userId: b.Buyer.userId,
          referenceId: b.id,
          Title: "ถึงเวลานัดหมาย: กรุณาอัปโหลดสลิป",
          Message: `ขณะนี้เป็นเวลานัดหมายของคุณ กรุณาอัปโหลดสลิปการชำระเงินส่วนที่เหลือ`,
          Status: "UNREAD",
          relatedProcess: "FINAL_SLIP_UPLOAD_REQUIRED",
        },
        {
          userId: b.Seller.userId,
          referenceId: b.id,
          Title: "ถึงเวลานัดหมายของคุณแล้ว!",
          Message: `ขณะนี้เป็นเวลานัดหมายของคุณกับ ${b.Buyer.user.First_name} เวลา ${t} น.`,
          Status: "UNREAD",
          relatedProcess: "APPOINTMENT_NOW",
        },
      ];
    });

    await prisma.$transaction([
      prisma.notification.createMany({ data: notifications }),
      prisma.booking.updateMany({
        where: { id: { in: due.map((x) => x.id) } },
        data: { isAtTimeAlertSent: true },
      }),
    ]);

    console.log(`🚀 [Scheduler] Sent ${notifications.length} at-time notifications.`);
  } catch (err) {
    console.error('[Scheduler] "At-time" alerts error:', err);
  }
}

// ========== 4) Cleanup: ลบ slot ที่หมดเวลาและยังไม่ถูกจอง ==========
async function cleanupExpiredSlots() {
  console.log("🧹 [Scheduler] Cleaning expired, unbooked slots...");
  const now = new Date();
  try {
    const result = await prisma.dateTimeSlot.deleteMany({
      where: { endTime: { lt: now }, isBooked: false },
    });
    if (result.count > 0) {
      console.log(`✅ [Scheduler] Cleaned ${result.count} expired slots.`);
    }
  } catch (err) {
    console.error("[Scheduler] Cleanup error:", err);
  }
}

// ========== Start all schedulers ==========
function startNotificationSchedulers() {
  console.log("🔔 Initializing notification schedulers...");
  cron.schedule("0 9 * * *", checkAndSendReminders,     { timezone: "Asia/Bangkok" }); // พรุ่งนี้ 09:00
  cron.schedule("0 8 * * *", checkAndSendDayOfAlerts,   { timezone: "Asia/Bangkok" }); // วันนี้ 08:00
  cron.schedule("* * * * *", checkAndSendAtTimeAlerts,  { timezone: "Asia/Bangkok" }); // ทุกนาที
  cron.schedule("0 * * * *", cleanupExpiredSlots,       { timezone: "Asia/Bangkok" }); // ต้นชั่วโมง
  console.log("⏰ All notification schedulers started (Reminders, Day-of, At-time, Cleanup).");
}

export {
  checkAndSendReminders,
  checkAndSendDayOfAlerts,
  checkAndSendAtTimeAlerts,
  cleanupExpiredSlots,
  startNotificationSchedulers,
};
