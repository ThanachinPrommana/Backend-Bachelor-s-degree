// server.js — merged & conflict-resolved (ESM)
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { readdirSync } from "fs";
import "dotenv/config";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import AdminJS from "adminjs";
import { Database, Resource, getModelByName } from "@adminjs/prisma";
import AdminJSExpress from "@adminjs/express";
import prisma from "./config/prisma.js";
import { startNotificationSchedulers } from "./Scheduler/notificationScheduler.js";
import { handleStripeWebhook } from "./controllers/payment.js";
import bcrypt from "bcryptjs";
import th from "./locales/th.js";

const PORT = process.env.PORT || 8200;
const app = express();
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =================================================================
 * 1) AdminJS setup
 * ================================================================= */
AdminJS.registerAdapter({ Database, Resource });
console.log("Successfully imported locale file:", th);

const admin = new AdminJS({
  resources: [
    {
      resource: { model: getModelByName("User"), client: prisma },
      options: { navigation: "ผู้ใช้", name: "ผู้ใช้งาน" },
    },
    {
      resource: { model: getModelByName("Buyer"), client: prisma },
      options: { navigation: "ผู้ใช้", name: "ผู้ซื้อ" },
    },
    {
      resource: { model: getModelByName("Seller"), client: prisma },
      options: { navigation: "ผู้ใช้", name: "ผู้ขาย" },
    },
    {
      resource: { model: getModelByName("PropertyPost"), client: prisma },
      options: { navigation: "โพสต์", name: "โพสต์ขายบ้าน" },
    },
    {
      resource: { model: getModelByName("Category"), client: prisma },
      options: { navigation: "โพสต์", name: "หมวดหมู่" },
    },
    {
      resource: { model: getModelByName("PropertyUnit"), client: prisma },
      options: { navigation: "โพสต์", name: "เลขที่บ้าน" },
    },
    {
      resource: { model: getModelByName("Deposit"), client: prisma },
      options: { navigation: "โพสต์", name: "มัดจำ" },
    },
    {
      resource: { model: getModelByName("DocumentUpload"), client: prisma },
      options: { navigation: "เอกสาร", name: "เอกสารที่อัปโหลด" },
    },
    {
      resource: { model: getModelByName("Payment"), client: prisma },
      options: { navigation: "ชำระเงิน", name: "ข้อมูลการชำระเงิน" },
    },
    {
      resource: { model: getModelByName("Notification"), client: prisma },
      options: { navigation: "การแจ้งเตือน", name: "ข้อมูลการแจ้งเตือน" },
    },
    {
      resource: { model: getModelByName("Image"), client: prisma },
      options: { navigation: "โพสต์", name: "รูปภาพของโพสต์" },
    },
    {
      resource: { model: getModelByName("Video"), client: prisma },
      options: { navigation: "โพสต์", name: "วิดิโอของโพสต์" },
    },
    {
      resource: { model: getModelByName("DateTimeSlot"), client: prisma },
      options: { navigation: "การนัดหมาย", name: "ตารางนัดหมาย" },
    },
    {
      resource: { model: getModelByName("Booking"), client: prisma },
      options: { navigation: "การนัดหมาย", name: "การจอง" },
    },
  ],
  rootPath: "/admin",
  branding: { companyName: "Yuu Yenn Property", logo: false },
  locale: {
    language: "th",
    availableLanguages: ["th"],
    translations: { th: th.translations },
  },
});

/* =================================================================
 * 2) Middlewares (logger, CORS, static)
 * ================================================================= */
app.use(morgan("dev"));

// ✅ allowlist ได้หลายโดเมน (fallback localhost)
const ALLOWLIST = (
  process.env.CLIENT_ORIGINS ||
  process.env.CLIENT_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin(origin, cb) {
      // อนุญาตจาก allowlist หรือกรณี non-browser (เช่น curl/postman) ที่ไม่มี Origin
      if (!origin || ALLOWLIST.includes(origin)) return cb(null, true);
      cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));

/* =================================================================
 * 3) ⚠️ Stripe Webhook ต้องมาก่อน parsers
 * ================================================================= */
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

/* =================================================================
 * 4) Body parsers (หลัง webhook)
 * ================================================================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =================================================================
 * 5) Session
 * ================================================================= */
if (IS_PRODUCTION) {
  // ต้องตั้งค่านี้เมื่ออยู่หลัง proxy (Render/Heroku/Nginx/Cloudflare) เพื่อให้ secure cookie ทำงาน
  app.set("trust proxy", 1);
}

const baseCookie = { maxAge: 2 * 60 * 60 * 1000, httpOnly: true };
const cookie = IS_PRODUCTION
  ? { ...baseCookie, secure: true, sameSite: "none" }
  : { ...baseCookie, secure: false, sameSite: "lax" };

app.use(
  session({
    secret: process.env.SESSION_SECRET || "some-strong-secret",
    resave: false,
    saveUninitialized: false, // 🔒 ไม่สร้าง session ว่างโดยไม่จำเป็น
    cookie,
  })
);

/* =================================================================
 * 6) Admin login/session guard
 * ================================================================= */
const authenticateAdmin = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { Email: email } });
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.Password);
  return isValid && user.userType === "Admin"
    ? { id: user.id, email: user.Email, userType: user.userType }
    : null;
};

// --- Router สำหรับหน้าสาธารณะ (Public) ของ Admin ---
const publicAdminRouter = express.Router();
publicAdminRouter.get("/login", (req, res) => {
  if (req.session.adminUser) return res.redirect(admin.options.rootPath);
  res.sendFile(path.join(__dirname, "/public/login.html"));
});
publicAdminRouter.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const adminUser = await authenticateAdmin(email, password);
  if (adminUser) {
    req.session.adminUser = adminUser;
    return res.redirect(admin.options.rootPath);
  }
  res.redirect("/admin/login");
});
publicAdminRouter.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/admin/login"));
});

const requireLogin = (req, res, next) => {
  if (req.session && req.session.adminUser) return next();
  res.redirect("/admin/login");
};

// ⚙️ AdminJS dashboard (ต้อง login)
const protectedAdminRouter = AdminJSExpress.buildRouter(admin);
app.use(admin.options.rootPath, publicAdminRouter);
app.use(admin.options.rootPath, requireLogin, protectedAdminRouter);

/* =================================================================
 * 7) App Routers (รองรับทั้ง ESM default และ CJS module.exports)
 * ================================================================= */
const mountRoutersFrom = async (dir) => {
  try {
    const full = path.join(__dirname, dir);
    for (const filename of readdirSync(full)) {
      if (!filename.endsWith(".js")) continue;
      // รองรับทั้ง default export (ESM) และ module.exports (CJS)
      const mod = await import(`./${dir}/${filename}`);
      const router = mod.default || mod;
      if (typeof router === "function") {
        app.use("/api", router);
        console.log(`➡️ Mounted: /api from ${dir}/${filename}`);
      } else if (router && typeof router === "object" && "handle" in router) {
        // กรณีส่งออกเป็น express.Router instance
        app.use("/api", router);
        console.log(`➡️ Mounted (instance): /api from ${dir}/${filename}`);
      } else {
        console.warn(`⚠️ Skip ${dir}/${filename}: no router export`);
      }
    }
  } catch (e) {
    // ถ้าโฟลเดอร์ไม่มี ให้ข้ามไปเฉย ๆ
    console.warn(`(info) Skip mounting from ./${dir}:`, e.message);
  }
};

// รองรับทั้งสอง convention
await mountRoutersFrom("routers");
await mountRoutersFrom("routes");

/* =================================================================
 * 8) Health & error handler
 * ================================================================= */
app.get("/healthz", (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

// Error handler ช่วย debug
app.use((err, _req, res, _next) => {
  console.error("❌ Error:", err?.message);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
});

/* =================================================================
 * 9) Start
 * ================================================================= */
app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
  startNotificationSchedulers();
});
