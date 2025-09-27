// config/prisma.js

import { PrismaClient } from '@prisma/client';

let prisma;

// โค้ดส่วนนี้ถูกต้องแล้ว สำหรับการใช้งานใน Development vs Production
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// 🔥 แก้ไขบรรทัดนี้
export default prisma;