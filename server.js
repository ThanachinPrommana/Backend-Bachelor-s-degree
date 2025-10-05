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
import bcrypt from "bcryptjs";

const PORT = process.env.PORT || 8200;
const app = express();

// --- Middlewares ---
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "some-strong-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
};
if (IS_PRODUCTION) {
  app.set("trust proxy", 1);
}
app.use(session(sessionOptions));

// --- API Routers ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routersPath = path.join(__dirname, "routers");
(async () => {
  for (const filename of readdirSync(routersPath)) {
    if (filename.endsWith(".js")) {
      const routeModule = await import(`./routers/${filename}`);
      app.use("/api", routeModule.default);
    }
  }
})();

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
  startNotificationSchedulers();
});
