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

import AdminJS from 'adminjs';
import { Database, Resource, getModelByName } from "@adminjs/prisma";
import AdminJSExpress from "@adminjs/express";
import { bundle } from '@adminjs/bundler';
import prisma from './config/prisma.js';
import { startNotificationSchedulers } from "./Scheduler/notificationScheduler.js";
import { handleStripeWebhook } from "./controllers/payment.js";
import bcrypt from 'bcryptjs';


const PORT = process.env.PORT || 8200;
const app = express();
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =================================================================
// 1. ตั้งค่า AdminJS
// =================================================================
AdminJS.registerAdapter({ Database, Resource });

// const logoutComponent = path.resolve(__dirname, './AdminUI/logout-button.jsx');
// console.log('ค่าของ __dirname คือ:', __dirname);
// console.log('Path ที่สร้างขึ้นคือ:', logoutComponent);

const admin = new AdminJS({
    resources: [
        {
            resource: { model: getModelByName("User"), client: prisma },
            options: {
                navigation: "ผู้ใช้",
                name: "ผู้ใช้งาน"
            },
        },
        {
            resource: { model: getModelByName("Buyer"), client: prisma },
            options: {
                navigation: "ผู้ใช้",
                name: "ผู้ซื้อ"
            }
        },
        {
            resource: { model: getModelByName("Seller"), client: prisma },
            options: {
                navigation: "ผู้ใช้",
                name: "ผู้ขาย"
            }
        },
        {
            resource: { model: getModelByName("PropertyPost"), client: prisma },
            options: { 
                navigation: "โพสต์" ,
                name:"โพสต์ขายบ้าน"
            }
        },
        {
            resource: { model: getModelByName("Category"), client: prisma },
            options: { 
                navigation: "โพสต์" ,
                name:"หมวดหมู่"
            }

        },
        {
            resource: { model: getModelByName("PropertyUnit"), client: prisma },
            options: { 
                navigation: "โพสต์",
                name:"เลขที่บ้าน"
            }
        },
        {
            resource: { model: getModelByName("Deposit"), client: prisma },
            options: { 
                navigation: "โพสต์",
                name:"มัดจำ"
            }
        },
        {
            resource: { model: getModelByName("DocumentUpload"), client: prisma },
            options: { 
                navigation: "เอกสาร",
                name:"เอกสารที่อัปโหลด"
            }
        },
        {
            resource: { model: getModelByName("Payment"), client: prisma },
            options: { 
                navigation: "ชำระเงิน",
                name:"ข้อมูลการชำระเงิน"
            }
        },
        {
            resource: { model: getModelByName("Notification"), client: prisma },
            options: { 
                navigation: "การแจ้งเตือน",
                name:"ข้อมูลการแจ้งเตือน"
            }
        },
        {
            resource: { model: getModelByName("Image"), client: prisma },
            options: { 
                navigation: "โพสต์" ,
                name:"รูปภาพของโพสต์"
            }
        },
        {
            resource: { model: getModelByName("Video"), client: prisma },
            options: { 
                navigation: "โพสต์" ,
                name:"วิดิโอของโพสต์"
            }
        },
        {
            resource: { model: getModelByName("DateTimeSlot"), client: prisma },
            options: { 
                navigation: "การนัดหมาย" ,
                name:"ตารางนัดหมาย"
            }
        },
        {
            resource: { model: getModelByName("Booking"), client: prisma },
            options: { 
                navigation: "การนัดหมาย",
                name:"การจอง" 
            }
        },

    ],
    rootPath: "/admin",
    branding: {
        companyName: 'Yuu Yenn Property',
        logo: false,
    },

});

// =================================================================
// 2. Middlewares พื้นฐาน
// =================================================================
app.use(morgan("dev"));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =================================================================
// 3. Session Middleware
// =================================================================
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "some-strong-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 2 * 60 * 60 * 1000, httpOnly: true, secure: false, sameSite: 'lax' }
};
if (IS_PRODUCTION) {
    app.set('trust proxy', 1);
}
app.use(session(sessionOptions));

// =================================================================
// 4. สร้าง Logic และ Routers
// =================================================================

// --- ส่วนจัดการ Logic การ Login ---
const authenticateAdmin = async (email, password) => {
    // แนะนำให้กลับไปใช้ findUnique หากคุณได้เพิ่ม @unique ใน schema แล้ว
    const user = await prisma.user.findUnique({ where: { Email: email } });
    if (!user) {
        return null;
    }

    const isValid = await bcrypt.compare(password, user.Password);

    if (isValid && user.userType === "Admin") {
        // ✅ คืนค่ากลับไปเป็นอ็อบเจ็กต์ธรรมดาที่มีแค่ข้อมูลที่จำเป็น
        return {
            id: user.id,
            email: user.Email,
            userType: user.userType,
        };
    }
    return null;
};

// --- Router สำหรับหน้าสาธารณะ (Public) ของ Admin ---
const publicAdminRouter = express.Router();
publicAdminRouter.get('/login', (req, res) => {
    // ถ้า login แล้ว ไปหน้า dashboard เลย
    if (req.session.adminUser) {
        return res.redirect(admin.options.rootPath);
    }
    res.sendFile(path.join(__dirname, '/public/login.html'));
});

publicAdminRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const adminUser = await authenticateAdmin(email, password);
    if (adminUser) {
        req.session.adminUser = adminUser;
        res.redirect(admin.options.rootPath);
    } else {
        res.redirect('/admin/login');
    }
});

publicAdminRouter.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
});

// --- Middleware สำหรับป้องกันหน้า Dashboard ---
const requireLogin = (req, res, next) => {
    // ตรวจสอบว่ามีอ็อบเจ็กต์ adminUser อยู่ใน session หรือไม่
    if (req.session && req.session.adminUser) {
        return next(); // ถ้าล็อกอินแล้ว ให้ไปต่อ
    }
    // ถ้ายังไม่ล็อกอิน ให้ redirect ไปที่หน้าล็อกอิน
    res.redirect('/admin/login');
};

// --- Router สำหรับหน้า Dashboard ที่ต้อง Login ---
const protectedAdminRouter = AdminJSExpress.buildRouter(admin);

// =================================================================
// 5. ประกอบร่าง Routers (สำคัญที่สุด)
// =================================================================
// 5.1) ให้ Express รู้จัก Router ที่ไม่ต้อง Login ก่อน
app.use(admin.options.rootPath, publicAdminRouter);

// 5.2) จากนั้น ค่อยให้ Express รู้จัก Router ที่ต้อง Login
//      โดยให้ผ่าน Middleware requireLogin ก่อนเสมอ
app.use(admin.options.rootPath, requireLogin, protectedAdminRouter);

// =================================================================
// 6. Routes อื่นๆ ของแอปพลิเคชัน
// =================================================================
app.post("/api/stripe/webhook", express.raw({ type: 'application/json' }), handleStripeWebhook);
const routersPath = path.join(__dirname, 'routers');
(async () => {
    for (const filename of readdirSync(routersPath)) {
        if (filename.endsWith('.js')) {
            const routeModule = await import(`./routers/${filename}`);
            app.use("/api", routeModule.default);
        }
    }
})();

// =================================================================
// 7. เริ่มการทำงานของ Server
// =================================================================
app.listen(PORT, () => {
    console.log(`🚀 Server on port ${PORT}`);
    startNotificationSchedulers();
});