// server.js — merged & conflict-resolved (ESM)
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { readdirSync } from "fs";
import "dotenv/config";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import AdminJS from 'adminjs';
import { Database, Resource } from "@adminjs/prisma";
import AdminJSExpress from "@adminjs/express";
import prisma from './config/prisma.js';
import { startNotificationSchedulers } from "./Scheduler/notificationScheduler.js";
import { handleStripeWebhook } from "./controllers/payment.js";
import bcrypt from 'bcryptjs';
import th from "./locales/th.js";
import { admin } from "./Admin/admin.config.js"; // ✅ นำเข้า config ที่คุณแยกไว้

const PORT = process.env.PORT || 8200;
const app = express();
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =================================================================
// 1. ตั้งค่า AdminJS Adapter
// =================================================================
AdminJS.registerAdapter({ Database, Resource });

/* =================================================================
 * 2) Middlewares (logger, CORS, static)
 * ================================================================= */
app.use(morgan("dev"));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.post("/api/stripe/webhook", express.raw({ type: 'application/json' }), handleStripeWebhook);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =================================================================
// 3. Session Middleware
// =================================================================
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "some-strong-secret",
  resave: false,
  saveUninitialized: false, // เปลี่ยนเป็น false ดีกว่าเพื่อลดภาระ memory
  cookie: { 
    maxAge: 2 * 60 * 60 * 1000, 
    httpOnly: true, 
    secure: false, 
    sameSite: 'lax' 
  }
};

if (IS_PRODUCTION) {
  app.set('trust proxy', 1);
  sessionOptions.cookie.secure = true;    // ต้องเป็น true ถึงจะใช้ sameSite: none ได้ (ต้องมี HTTPS)
  sessionOptions.cookie.sameSite = 'none'; // ต้องเป็น none สำหรับ Vercel -> Render (Cross-Origin)
}
app.use(session(sessionOptions));

// =================================================================
// 4. Authentication สำหรับ AdminJS
// =================================================================
const authenticateAdmin = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { Email: email } });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.Password);
  if (isValid && user.userType === "Admin") {
    return {
      id: user.id,
      email: user.Email,
      userType: user.userType,
    };
  }
  return null;
};

// =================================================================
// 5. Router สำหรับหน้า Login และ Logout ของ Admin
// =================================================================
const publicAdminRouter = express.Router();

publicAdminRouter.get('/login', (req, res) => {
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
  req.session.destroy(() => res.redirect('/admin/login'));
});

app.use(admin.options.rootPath, publicAdminRouter);

// =================================================================
// 6. ป้องกัน Dashboard ต้อง Login ก่อน
// =================================================================
const requireLogin = (req, res, next) => {
  if (req.session && req.session.adminUser) return next();
  res.redirect('/admin/login');
};

// =================================================================
// 7. ผูก AdminJS Router (Dashboard)
// =================================================================
const protectedAdminRouter = AdminJSExpress.buildRouter(admin);
app.use(admin.options.rootPath, requireLogin, protectedAdminRouter);

// =================================================================
// 8. API Routes อื่นๆ
// =================================================================
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
// 9. Start Server
// =================================================================
app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
  startNotificationSchedulers();
});



// import express from 'express';
// import cors from 'cors';
// import morgan from 'morgan';
// import { readdirSync } from 'fs';
// import 'dotenv/config';
// import session from 'express-session';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // ❌ ไม่ต้อง import AdminJS หรือ config ที่นี่แล้ว เราจะไป import ข้างในแทน

// const PORT = process.env.PORT || 8200;
// const app = express();
// const IS_PRODUCTION = process.env.NODE_ENV === 'production';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // --- Middlewares พื้นฐาน (เหมือนเดิม) ---
// app.use(morgan("dev"));
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:5173',
//   credentials: true,
// }));
// app.use(express.static(path.join(__dirname, 'public')));
// // ...middlewares อื่นๆ เหมือนเดิม...
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(session({
//     secret: process.env.SESSION_SECRET || "some-strong-secret",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 2 * 60 * 60 * 1000 }
// }));


// // ✅ สร้างฟังก์ชัน async เพื่อเริ่มการทำงานของเซิร์ฟเวอร์
// const startServer = async () => {
//     // ✅ 1. ย้าย import ทั้งหมดที่เกี่ยวกับ AdminJS เข้ามาไว้ในนี้
//     const AdminJS = (await import('adminjs')).default;
//     const AdminJSExpress = (await import('@adminjs/express')).default;
//     const { Database, Resource } = await import('@adminjs/prisma');
//     const { admin } = await import('./Admin/admin.config.js');
//     const prisma = (await import('./config/prisma.js')).default;
//     const bcrypt = (await import('bcryptjs')).default;

//     AdminJS.registerAdapter({ Database, Resource });

//     // --- Authentication (เหมือนเดิม) ---
//     const authenticateAdmin = async (email, password) => {
//         const user = await prisma.user.findUnique({ where: { Email: email } });
//         if (user && await bcrypt.compare(password, user.Password) && user.userType === "Admin") {
//             return user;
//         }
//         return null;
//     };

//     // --- Custom Login Router (เหมือนเดิม) ---
//     const publicAdminRouter = express.Router();
//     publicAdminRouter.get('/login', (req, res) => res.sendFile(path.join(__dirname, '/public/login.html')));
//     publicAdminRouter.post('/login', async (req, res) => {
//         const { email, password } = req.body;
//         const adminUser = await authenticateAdmin(email, password);
//         if (adminUser) {
//             req.session.adminUser = adminUser;
//             res.redirect(admin.options.rootPath);
//         } else {
//             res.redirect('/admin/login');
//         }
//     });
//     publicAdminRouter.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/admin/login')));
//     app.use(admin.options.rootPath, publicAdminRouter);

//     // --- Middleware ป้องกันการเข้าถึง (เหมือนเดิม) ---
//     const requireLogin = (req, res, next) => {
//         if (req.session?.adminUser) return next();
//         res.redirect('/admin/login');
//     };

//     // ✅ 2. สร้าง AdminJS Router หลังจาก import ทุกอย่างเสร็จแล้ว
//     const protectedAdminRouter = AdminJSExpress.buildRouter(admin);
//     app.use(admin.options.rootPath, requireLogin, protectedAdminRouter);

//     // --- API Routes อื่นๆ (เหมือนเดิม) ---
//     const routersPath = path.join(__dirname, 'routers');
//     for (const filename of readdirSync(routersPath)) {
//         if (filename.endsWith('.js')) {
//             const routeModule = await import(`./routers/${filename}`);
//             app.use("/api", routeModule.default);
//         }
//     }

//     // --- Start Server (เหมือนเดิม) ---
//     app.listen(PORT, () => {
//         console.log(`🚀 Server on port ${PORT}`);
//         // startNotificationSchedulers(); // หากมีฟังก์ชันนี้ ให้ย้ายมา
//     });
// };

// // ✅ 3. เรียกใช้ฟังก์ชัน startServer
// startServer();
// server.js (ฉบับแก้ไขสมบูรณ์)
// server.js (ฉบับแก้ไขสมบูรณ์ - กลับมาใช้ Custom Login Page)
