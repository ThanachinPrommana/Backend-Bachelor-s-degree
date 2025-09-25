// Scheduler/notificationScheduler.js  (CommonJS ล้วน)
const cron = require("node-cron");
const prisma = require("../config/prisma");

// --- ฟังก์ชันที่ 1: พรุ่งนี้ ---
async function checkAndSendReminders() {
  console.log('⏰ [Scheduler] Running job: Checking for TOMORROW appointments...');
  const now = new Date();
  const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const endOfTomorrow   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);

  try {
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        isReminderSent: false,
        dateTimeSlot: { startTime: { gte: startOfTomorrow, lte: endOfTomorrow } },
      },
      include: { Buyer: { include: { user: true } }, Seller: { include: { user: true } }, dateTimeSlot: true },
    });

    if (upcomingBookings.length === 0) {
      console.log("✅ [Scheduler] No upcoming reminders to send for tomorrow.");
      return;
    }

    const notificationsToCreate = upcomingBookings.flatMap((b) => [
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
      prisma.notification.createMany({ data: notificationsToCreate }),
      prisma.booking.updateMany({
        where: { id: { in: upcomingBookings.map((b) => b.id) } },
        data: { isReminderSent: true },
      }),
    ]);

    console.log(`🚀 [Scheduler] Successfully sent ${notificationsToCreate.length} reminders.`);
  } catch (error) {
    console.error("[Scheduler] Error processing reminders:", error);
  }
}

// --- ฟังก์ชันที่ 2: วันนี้ ---
async function checkAndSendDayOfAlerts() {
  console.log('[Scheduler] Running job: Checking for TODAY appointments...');
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfToday   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  try {
    const todaysBookings = await prisma.booking.findMany({
      where: {
        isDayOfAlertSent: false,
        dateTimeSlot: { startTime: { gte: startOfToday, lte: endOfToday } },
      },
      include: { Buyer: { include: { user: true } }, Seller: { include: { user: true } }, dateTimeSlot: true },
    });

    if (todaysBookings.length === 0) {
      console.log("✅ [Scheduler] No appointments today to send alerts for.");
      return;
    }

    const notificationsToCreate = todaysBookings.flatMap((b) => [
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
      prisma.notification.createMany({ data: notificationsToCreate }),
      prisma.booking.updateMany({
        where: { id: { in: todaysBookings.map((b) => b.id) } },
        data: { isDayOfAlertSent: true },
      }),
    ]);

    console.log(`🚀 [Scheduler] Successfully sent ${notificationsToCreate.length} day-of alerts.`);
  } catch (error) {
    console.error("[Scheduler] Error processing day-of alerts:", error);
  }
}

// --- ฟังก์ชันที่ 3: ถึงเวลาพอดี (ทุกนาที) ---
async function checkAndSendAtTimeAlerts() {
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

  try {
    const dueBookings = await prisma.booking.findMany({
      where: {
        isAtTimeAlertSent: false,
        dateTimeSlot: { startTime: { gte: oneMinuteAgo, lte: now } },
      },
      include: { Buyer: { include: { user: true } }, Seller: { include: { user: true } }, dateTimeSlot: true },
    });

    if (dueBookings.length === 0) return;

    console.log(`🔥 [Scheduler] Found ${dueBookings.length} appointments due right now!`);

    const notificationsToCreate = dueBookings.flatMap((b) => [
      {
        userId: b.Buyer.userId,
        referenceId: b.id,
        Title: "ถึงเวลานัดหมายของคุณแล้ว!",
        Message: `ขณะนี้เป็นเวลานัดหมายของคุณกับ ${b.Seller.user.First_name} เวลา ${b.dateTimeSlot.startTime.toLocaleTimeString("th-TH")} น.`,
        Status: "UNREAD",
        relatedProcess: "APPOINTMENT_NOW",
      },
      {
        userId: b.Seller.userId,
        referenceId: b.id,
        Title: "ถึงเวลานัดหมายของคุณแล้ว!",
        Message: `ขณะนี้เป็นเวลานัดหมายของคุณกับ ${b.Buyer.user.First_name} เวลา ${b.dateTimeSlot.startTime.toLocaleTimeString("th-TH")} น.`,
        Status: "UNREAD",
        relatedProcess: "APPOINTMENT_NOW",
      },
    ]);

    await prisma.$transaction([
      prisma.notification.createMany({ data: notificationsToCreate }),
      prisma.booking.updateMany({
        where: { id: { in: dueBookings.map((b) => b.id) } },
        data: { isAtTimeAlertSent: true },
      }),
    ]);

    console.log(`🚀 [Scheduler] Successfully sent ${notificationsToCreate.length} "at-time" alerts.`);
  } catch (error) {
    console.error('[Scheduler] Error processing "at-time" alerts:', error);
  }
}

// --- ฟังก์ชันที่ 4: เคลียร์ slot ที่หมดเวลาและยังไม่ถูกจอง ---
async function cleanupExpiredSlots() {
  console.log('🧹 [Scheduler] Running job: Cleaning up expired, unbooked time slots...');
  const now = new Date();
  try {
    const result = await prisma.dateTimeSlot.deleteMany({
      where: { endTime: { lt: now }, isBooked: false }
    });
    if (result.count > 0) {
      console.log(`✅ [Scheduler] Successfully cleaned up ${result.count} expired slots.`);
    }
  } catch (error) {
    console.error('[Scheduler] Error during expired slot cleanup:', error);
  }
}

// --- เริ่มงานทั้งหมด ---
function startNotificationSchedulers() {
  console.log("🔔 Initializing notification schedulers...");
  cron.schedule("0 9 * * *", checkAndSendReminders,   { timezone: "Asia/Bangkok" }); // พรุ่งนี้ 09:00
  cron.schedule("0 8 * * *", checkAndSendDayOfAlerts, { timezone: "Asia/Bangkok" }); // วันนี้ 08:00
  cron.schedule("* * * * *", checkAndSendAtTimeAlerts,{ timezone: "Asia/Bangkok" }); // ทุกนาที
  // ตัวอย่าง: ล้าง slot ทุกชั่วโมง
  cron.schedule("0 * * * *", cleanupExpiredSlots,      { timezone: "Asia/Bangkok" });

  console.log("⏰ All notification schedulers have been started.");
}

module.exports = {
  checkAndSendReminders,
  checkAndSendDayOfAlerts,
  checkAndSendAtTimeAlerts,
  cleanupExpiredSlots,
  startNotificationSchedulers,
};
