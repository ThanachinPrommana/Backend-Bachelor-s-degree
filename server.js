// --- server.js (ESM, merged & hardened with AdminJS) ---

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import session from "express-session";
import bcrypt from "bcryptjs";

import prisma from "./config/prisma.js";
import { startNotificationSchedulers } from "./Scheduler/notificationScheduler.js";
import { handleStripeWebhook } from "./controllers/payment.js";

// ===== AdminJS (with Prisma adapter) =====
import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Database, Resource, getModelByName } from "@adminjs/prisma";

const PORT = process.env.PORT || 8200;
const app = express();
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ✅ อยู่หลัง proxy (Render/Heroku/Nginx/Cloudflare) ให้ตั้งไว้เพื่อให้ secure cookie ทำงานถูก
app.set("trust proxy", 1);

// --- Logger ---
app.use(morgan("dev"));

// --- CORS (allowlist) ---
const DEFAULT_ORIGIN = "http://localhost:5173";
const ORIGINS = (
  process.env.CLIENT_ORIGINS ||
  process.env.CLIENT_URL ||
  DEFAULT_ORIGIN
)
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin(origin, cb) {
      // อนุญาต no-origin (Postman/Server-to-server) และ origin ที่อยู่ใน allowlist
      if (!origin || ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true, // ✅ ให้ cookie ข้าม origin ได้
  })
);

// --- Path helpers ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Public static (สำหรับหน้า login ของ AdminJS) =====
app.use(express.static(path.join(__dirname, "public")));

// --- Stripe webhook (raw body) ต้องมาก่อน express.json() ---
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// --- Body parser ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Session ---
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "some-strong-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000, // 2 ชั่วโมง
    httpOnly: true,
    secure: IS_PRODUCTION, // ✅ prod ต้องใช้ https
    sameSite: IS_PRODUCTION ? "none" : "lax", // dev = lax, prod = none (รองรับ cross-site cookie)
    // domain: process.env.COOKIE_DOMAIN || undefined,
  },
};
app.use(session(sessionOptions));

/* =================================================================
 *  AdminJS Setup (Prisma)
 * ================================================================= */
AdminJS.registerAdapter({ Database, Resource });

// สร้าง instance ของ AdminJS + ลงทะเบียน resources หลัก ๆ
const admin = new AdminJS({
  rootPath: "/admin",
  branding: {
    companyName: "Yuu Yenn Property",
    logo: false,
  },
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
});

// ===== Admin: Custom login (session-based) =====
const authenticateAdmin = async (email, password) => {
  // ต้องแน่ใจว่า Email เป็น unique ใน schema
  const user = await prisma.user.findUnique({ where: { Email: email } });
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.Password);
  if (isValid && user.userType === "Admin") {
    return { id: user.id, email: user.Email, userType: user.userType };
  }
  return null;
};

const publicAdminRouter = express.Router();
publicAdminRouter.get("/login", (req, res) => {
  if (req.session.adminUser) return res.redirect(admin.options.rootPath);
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
publicAdminRouter.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const adminUser = await authenticateAdmin(email, password);
  if (adminUser) {
    req.session.adminUser = adminUser;
    return res.redirect(admin.options.rootPath);
  }
  return res.redirect("/admin/login");
});
publicAdminRouter.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/admin/login"));
});

const requireLogin = (req, _res, next) => {
  if (req.session && req.session.adminUser) return next();
  return _res.redirect("/admin/login");
};

const protectedAdminRouter = AdminJSExpress.buildRouter(admin);

// === Mount Admin routes ===
app.use(admin.options.rootPath, publicAdminRouter); // public routes: /admin/login
app.use(admin.options.rootPath, requireLogin, protectedAdminRouter); // protected dashboard

/* =================================================================
 *  App Routers
 * ================================================================= */

const routersPath = path.join(__dirname, "routers");

async function mountRouters() {
  const files = readdirSync(routersPath).filter((f) => f.endsWith(".js"));
  for (const filename of files) {
    const routeModule = await import(`./routers/${filename}`);
    const router = routeModule.default || routeModule;
    if (typeof router === "function") {
      app.use("/api", router);
      console.log(`➡️  Mounted router: /api (file: ${filename})`);
    } else {
      console.warn(`⚠️  Skip ${filename}: no router export found`);
    }
  }
}

// --- Health check ---
app.get("/healthz", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// --- Start server ---
async function start() {
  try {
    await mountRouters();
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
      console.log(`✅ Admin panel at ${admin.options.rootPath}`);
      startNotificationSchedulers();
    });
  } catch (err) {
    console.error("Fatal error during bootstrap:", err);
    process.exit(1);
  }
}

start();
