// --- server.js (ESM, hardened & พร้อม comment) ---

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import session from "express-session";

import prisma from "./config/prisma.js";
import { startNotificationSchedulers } from "./Scheduler/notificationScheduler.js";
import { handleStripeWebhook } from "./controllers/payment.js";

const PORT = process.env.PORT || 8200;
const app = express();

// ✅ อยู่หลัง proxy (Render/Heroku/Nginx/Cloudflare) ให้ตั้งไว้เพื่อให้ secure cookie ทำงานถูก
app.set("trust proxy", 1);

// --- Logger ---
app.use(morgan("dev"));

// --- CORS ---
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
      // อนุญาต no-origin (เช่น Postman) และ origin ที่อยู่ใน allowlist
      if (!origin || ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true, // ✅ สำคัญ: ให้ cookie ข้าม origin ได้
  })
);

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
    secure: process.env.NODE_ENV === "production", // ✅ prod ต้องใช้ https
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // dev = lax, prod = none
    // domain: process.env.COOKIE_DOMAIN || undefined, // ใช้ถ้าต้องการแชร์ cookie ข้าม subdomain
  },
};
app.use(session(sessionOptions));

// --- Routers ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
      startNotificationSchedulers();
    });
  } catch (err) {
    console.error("Fatal error during bootstrap:", err);
    process.exit(1);
  }
}

start();
