// --- controllers/admin.js ---

const AdminJS = require('adminjs');
const AdminJSPrisma = require('@adminjs/prisma');
const prisma = require('../config/prisma'); // ตรวจสอบว่า path ไปยัง prisma client ถูกต้อง

// 1. จัดการการนำเข้า Module (ESM/CommonJS) - ส่วนนี้ดีอยู่แล้ว
const AdminJSBase = AdminJS.default || AdminJS;
const PrismaAdapter = AdminJSPrisma.PrismaAdapter; // V7+ แนะนำให้เข้าถึง PrismaAdapter โดยตรง

// 2. ลงทะเบียน Adapter (ทำครั้งเดียว)
// นี่คือวิธีที่ถูกต้องสำหรับเวอร์ชันใหม่
AdminJS.registerAdapter({
    Adapter: PrismaAdapter,
    Database: prisma,
});

// 3. ฟังก์ชันสำหรับตั้งค่า AdminJS Options
// เราจะทำให้ฟังก์ชันนี้เรียบง่ายขึ้นมาก
exports.getAdminJsOptions = () => {
    return {
        // ไม่ต้องส่ง AdminJSClass กลับไปแล้ว
        options: {
            rootPath: '/admin', // URL สำหรับหน้า Admin
            branding: {
                companyName: 'Project Admin Panel',
                withMadeWithLove: false, // เอา "Made with ❤️ by AdminJS" ออก
            },
            // 🔥 แก้ไข: ไม่ต้องใช้ dmmf ด้วยตัวเองอีกต่อไป
            // แค่ระบุ resource โดยตรง AdminJS จะจัดการที่เหลือให้เอง
            resources: [
                // เพิ่มโมเดลทั้งหมดที่คุณต้องการจัดการที่นี่
                { resource: prisma.user, options: { /* ตั้งค่าเฉพาะโมเดล User */ } },
                { resource: prisma.propertyPost, options: { /* ตั้งค่าเฉพาะโมเดล PropertyPost */ } },
                { resource: prisma.seller, options: { /* ตั้งค่าเฉพาะโมเดล Seller */ } },
                { resource: prisma.buyer, options: { /* ตั้งค่าเฉพาะโมเดล Buyer */ } },
                { resource: prisma.booking, options: { /* ตั้งค่าเฉพาะโมเดล Booking */ } },
                { resource: prisma.dateTimeSlot, options: { /* ตั้งค่าเฉพาะโมเดล DateTimeSlot */ } },
                { resource: prisma.deposit, options: { /* ตั้งค่าเฉพาะโมเดล Deposit */ } },
                { resource: prisma.notification, options: { /* ตั้งค่าเฉพาะโมเดล Notification */ } },
                // ... เพิ่มโมเดลอื่นๆ ตามต้องการ
            ],
        },
    };
};