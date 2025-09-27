// --- server.js (ฉบับแก้ไข) ---

// 1. Imports - นำเข้าทุกอย่างที่จำเป็นไว้ด้านบนสุด
// const express = require("express");
// const cors = require("cors");
// const morgan = require("morgan");
// const { readdirSync } = require("fs");
// require("dotenv").config();
// const session = require("express-session");

// const AdminJS = require('adminjs');
// const AdminJSExpress = require('@adminjs/express');
// const { PrismaAdapter } = require('@adminjs/prisma'); // 💡 Import Adapter โดยตรง
// const prisma = require('./config/prisma');
// const { getAdminJsOptions } = require('./controllers/admin'); // 💡 เราต้องการแค่ Options จาก Controller

// const { startNotificationSchedulers } = require("./Scheduler/notificationScheduler");
// const { handleStripeWebhook } = require("./controllers/payment");

// const PORT = process.env.PORT || 8200;
// const app = express();

// // --- 2. Middlewares ---
// app.use(morgan("dev"));

// app.use(cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:5173',
//     credentials: true,
// }));

// // Webhook ต้องอยู่ก่อน express.json()
// app.post(
//     "/api/stripe/webhook",
//     express.raw({ type: 'application/json' }),
//     handleStripeWebhook
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const sessionOptions = {
//     secret: process.env.SESSION_SECRET || "some-strong-secret",
//     resave: false, // แนะนำให้เป็น false เพื่อประสิทธิภาพ
//     saveUninitialized: false, // แนะนำให้เป็น false
//     cookie: {
//         maxAge: 2 * 60 * 60 * 1000, // 2 hours
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production", // เป็น true เมื่อ deploy จริง
//         sameSite: "lax",
//     }
// };
// app.use(session(sessionOptions));


// // --- 3. 🔥🔥 ส่วน AdminJS ที่แก้ไขใหม่ทั้งหมด 🔥🔥 ---

// // 3.1 ลงทะเบียน Prisma Adapter (ทำแค่ครั้งเดียว)
// AdminJS.registerAdapter({
//     Database: prisma,
//     Adapter: PrismaAdapter,
// });

// // 3.2 ดึง Options จาก Controller
// const { options } = getAdminJsOptions();

// // 3.3 สร้าง AdminJS Instance
// const admin = new AdminJS(options);

// // 3.4 สร้าง Admin Router พร้อมระบบ Authentication ที่ถูกต้อง
// const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
//     admin,
//     {
//         // ใช้ฟังก์ชัน authenticate ที่ตรวจสอบ session โดยตรงที่นี่เลย
//         authenticate: async (req, res) => {
//             if (req.session && req.session.user && req.session.user.userType === 'Admin') {
//                 return req.session.user; // ถ้าเป็น Admin ใน session, อนุญาตให้เข้า
//             }
//             return false; // ไม่อนุญาต
//         },
//         cookiePassword: process.env.SESSION_SECRET || "some-strong-secret",
//         cookieName: 'connect.sid', // ชื่อ session cookie ปกติของ express-session
//     }
// );

// // 3.5 นำ AdminJS Router ไปใช้งาน
// app.use(admin.options.rootPath, adminRouter);

// // -----------------------------------------------------------------------


// // --- 4. API Routers ปกติของคุณ ---
// readdirSync("./routers").map((filename) => {
//     app.use("/api", require("./routers/" + filename));
// });


// // --- 5. เริ่มต้น Server ---
// app.listen(PORT, () => {
//     console.log(`🚀 Server on port ${PORT}`);
//     console.log(`✅ Admin panel at http://localhost:${PORT}/admin`);
//     startNotificationSchedulers();
// });


// --- server.js (เปลี่ยนเป็น ES Modules) ---

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { readdirSync } from 'fs';
import 'dotenv/config';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

// Prisma ยังคงอยู่เผื่อส่วนอื่นของแอปคุณต้องใช้
import prisma from './config/prisma.js'; 

// ✅ import ฟังก์ชัน scheduler แบบ ESM (named export)
import { startNotificationSchedulers } from "./Scheduler/notificationScheduler.js";

// Stripe webhook controller
import { handleStripeWebhook } from "./controllers/payment.js";

const PORT = process.env.PORT || 8200;
const app = express();

// --- 2. Middlewares ---
app.use(morgan("dev"));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

// Webhook ต้องอยู่ก่อน express.json()
app.post("/api/stripe/webhook", express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "some-strong-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // เป็น true เมื่อ deploy จริง
        sameSite: "lax"
    }
};
app.use(session(sessionOptions));

// --- 4. API Routers ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routersPath = path.join(__dirname, 'routers');

(async () => {
    for (const filename of readdirSync(routersPath)) {
        if (filename.endsWith('.js')) {
            const routeModule = await import(`./routers/${filename}`);
            app.use("/api", routeModule.default);
        }
    }
})();

// --- 5. เริ่มต้น Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server on port ${PORT}`);
    // ✅ เรียกใช้ Scheduler หลังเซิร์ฟเวอร์สตาร์ท
    startNotificationSchedulers();
});
