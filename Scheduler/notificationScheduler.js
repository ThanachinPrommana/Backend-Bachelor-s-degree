import cron from "node-cron";
import prisma from "../config/prisma.js";

// --- ฟังก์ชันที่ 1: ตรวจสอบและส่งการแจ้งเตือนล่วงหน้า ---
export const checkAndSendReminders = async () => {
  console.log('⏰ [Scheduler] Running job: Checking for TOMORROW appointments...');
  const now = new Date();
  const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);
  try {
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        isReminderSent: false,
        dateTimeSlot: {
          startTime: { gte: startOfTomorrow, lte: endOfTomorrow },
        },
      },
      include: { Buyer: { include: { user: true } }, Seller: { include: { user: true } }, dateTimeSlot: true },
    });
    if (upcomingBookings.length === 0) {
      console.log('[Scheduler] No upcoming reminders to send for tomorrow.');
      return;
    }
    const notificationsToCreate = upcomingBookings.flatMap(booking => [
      {
        userId: booking.Buyer.userId,
        referenceId: booking.id,
        Title: 'แจ้งเตือนนัดหมายวันพรุ่งนี้',
        Message: `คุณมีนัดหมายกับ ${booking.Seller.user.First_name} ในวันพรุ่งนี้ เวลา ${booking.dateTimeSlot.startTime.toLocaleTimeString('th-TH')} น.`,
        Status: 'UNREAD',
        relatedProcess: 'APPOINTMENT_REMINDER',
      },
      {
        userId: booking.Seller.userId,
        referenceId: booking.id,
        Title: 'แจ้งเตือนนัดหมายวันพรุ่งนี้',
        Message: `คุณมีนัดหมายกับ ${booking.Buyer.user.First_name} ในวันพรุ่งนี้ เวลา ${booking.dateTimeSlot.startTime.toLocaleTimeString('th-TH')} น.`,
        Status: 'UNREAD',
        relatedProcess: 'APPOINTMENT_REMINDER',
      }
    ]);
    await prisma.$transaction([
      prisma.notification.createMany({ data: notificationsToCreate }),
      prisma.booking.updateMany({
        where: { id: { in: upcomingBookings.map(b => b.id) } },
        data: { isReminderSent: true },
      }),
    ]);
    console.log(`🚀 [Scheduler] Successfully sent ${notificationsToCreate.length} reminders.`);
  } catch (error) {
    console.error('[Scheduler] Error processing reminders:', error);
  }
};

// --- ฟังก์ชันที่ 2: ตรวจสอบและส่งการแจ้งเตือนใน "วันนัดหมาย" ---
export const checkAndSendDayOfAlerts = async () => {
  console.log('[Scheduler] Running job: Checking for TODAY appointments...');
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  try {
    const todaysBookings = await prisma.booking.findMany({
      where: {
        isDayOfAlertSent: false,
        dateTimeSlot: {
          startTime: { gte: startOfToday, lte: endOfToday },
        },
      },
      include: { Buyer: { include: { user: true } }, Seller: { include: { user: true } }, dateTimeSlot: true },
    });
    if (todaysBookings.length === 0) {
      console.log('[Scheduler] No appointments today to send alerts for.');
      return;
    }
    const notificationsToCreate = todaysBookings.flatMap(booking => [
      {
        userId: booking.Buyer.userId,
        referenceId: booking.id,
        Title: 'การนัดหมายของคุณคือวันนี้!',
        Message: `อย่าลืม! วันนี้คุณมีนัดหมายกับ ${booking.Seller.user.First_name} เวลา ${booking.dateTimeSlot.startTime.toLocaleTimeString('th-TH')} น.`,
        Status: 'UNREAD',
        relatedProcess: 'APPOINTMENT_ALERT',
      },
      {
        userId: booking.Seller.userId,
        referenceId: booking.id,
        Title: 'การนัดหมายของคุณคือวันนี้!',
        Message: `อย่าลืม! วันนี้คุณมีนัดหมายกับ ${booking.Buyer.user.First_name} เวลา ${booking.dateTimeSlot.startTime.toLocaleTimeString('th-TH')} น.`,
        Status: 'UNREAD',
        relatedProcess: 'APPOINTMENT_ALERT',
      }
    ]);
    await prisma.$transaction([
      prisma.notification.createMany({ data: notificationsToCreate }),
      prisma.booking.updateMany({
        where: { id: { in: todaysBookings.map(b => b.id) } },
        data: { isDayOfAlertSent: true },
      }),
    ]);
    console.log(`[Scheduler] Successfully sent ${notificationsToCreate.length} day-of alerts.`);
  } catch (error) {
    console.error('[Scheduler] Error processing day-of alerts:', error);
  }
};

// --- ฟังก์ชันที่ 3: แจ้งเตือน ณ เวลานัดหมาย ---
export const checkAndSendAtTimeAlerts = async () => {
  const now = new Date();
  // ขยายช่วงเวลาเล็กน้อยเพื่อป้องกันการตกหล่น
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  try {
    const dueBookings = await prisma.booking.findMany({
      where: {
        isAtTimeAlertSent: false,
        bookingStatus: 'CONFIRMED', // 🔥 ค้นหาเฉพาะการจองที่ยืนยันแล้ว และยังไม่ได้อัปสลิปสุดท้าย
        dateTimeSlot: {
          startTime: { gte: fiveMinutesAgo, lte: now },
        },
      },
      include: {
        Buyer: { include: { user: true } },
        Seller: { include: { user: true } },
        dateTimeSlot: true
      },
    });

    if (dueBookings.length === 0) {
      return; // ไม่มีนัดหมายที่ถึงเวลา
    }

    console.log(`🔥 [Scheduler] Found ${dueBookings.length} appointments due now! Preparing alerts...`);

    // สร้างการแจ้งเตือนที่แตกต่างกันสำหรับผู้ซื้อและผู้ขาย
    const notificationsToCreate = dueBookings.flatMap(booking => {
      const appointmentTime = booking.dateTimeSlot.startTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

      return [
        // --- 🔔 การแจ้งเตือนสำหรับผู้ซื้อ (Buyer) ---
        {
          userId: booking.Buyer.userId,
          referenceId: booking.id,
          Title: 'ถึงเวลานัดหมาย: กรุณาอัปโหลดสลิป',
          Message: `ขณะนี้เป็นเวลานัดหมายของคุณ กรุณากดเพื่ออัปโหลดสลิปการชำระเงินส่วนที่เหลือ`,
          Status: 'UNREAD',
          // 🔥 ใช้ relatedProcess พิเศษเพื่อให้ Frontend รู้ว่าต้องเปิดหน้าอัปโหลด
          relatedProcess: 'FINAL_SLIP_UPLOAD_REQUIRED',
        },
        // --- 🔔 การแจ้งเตือนสำหรับผู้ขาย (Seller) ---
        {
          userId: booking.Seller.userId,
          referenceId: booking.id,
          Title: 'ถึงเวลานัดหมายของคุณแล้ว!',
          Message: `ขณะนี้เป็นเวลานัดหมายของคุณกับ ${booking.Buyer.user.First_name} เวลา ${appointmentTime} น.`,
          Status: 'UNREAD',
          relatedProcess: 'APPOINTMENT_NOW', // ผู้ขายแค่รับรู้ว่านัดเริ่มแล้ว
        }
      ]
    });

    // ทำ Transaction เพื่อสร้าง Notification และอัปเดตสถานะ Booking
    await prisma.$transaction([
      prisma.notification.createMany({ data: notificationsToCreate }),
      prisma.booking.updateMany({
        where: { id: { in: dueBookings.map(b => b.id) } },
        data: {
          isAtTimeAlertSent: true, // อัปเดตสถานะว่าส่งแจ้งเตือน "ณ เวลา" ไปแล้ว
        },
      }),
    ]);

    console.log(`🚀 [Scheduler] Successfully sent ${notificationsToCreate.length} "at-time" alerts.`);
  } catch (error) {
    console.error('[Scheduler] Error processing "at-time" alerts:', error);
  }
};

// --- 🔥 ฟังก์ชันที่ 4 (ใหม่): ลบ Slot ที่เลยเวลาและยังไม่ถูกจอง ---
export const cleanupExpiredSlots = async () => {
  console.log('🧹 [Scheduler] Running job: Cleaning up expired, unbooked time slots...');
  const now = new Date();
  try {
    const result = await prisma.dateTimeSlot.deleteMany({
      where: {
        endTime: {
          lt: now // lt = less than (น้อยกว่าเวลาปัจจุบัน)
        },
        isBooked: false // และยังไม่ถูกจอง
      }
    });

    if (result.count > 0) {
      console.log(`✅ [Scheduler] Successfully cleaned up ${result.count} expired slots.`);
    }
  } catch (error) {
    console.error('[Scheduler] Error during expired slot cleanup:', error);
  }
};

// --- ฟังก์ชันหลักสำหรับเริ่ม Scheduler ทั้งหมด ---
export const startNotificationSchedulers = () => {
  console.log('🔔 Initializing notification schedulers...');
  cron.schedule('0 9 * * *', checkAndSendReminders, {
    timezone: "Asia/Bangkok",
  });
  cron.schedule('0 8 * * *', checkAndSendDayOfAlerts, {
    timezone: "Asia/Bangkok",
  });
  cron.schedule('* * * * *', checkAndSendAtTimeAlerts, {
    timezone: "Asia/Bangkok",
  });

  // 🔥 เพิ่ม: ตั้งเวลาให้ฟังก์ชันลบข้อมูลทำงานทุกชั่วโมง
  cron.schedule('0 * * * *', cleanupExpiredSlots, { // ทำงานทุกชั่วโมง ณ นาทีที่ 0
    timezone: "Asia/Bangkok",
  });

  console.log('⏰ All notification schedulers have been started (Reminders, Alerts, Cleanup).');
};

