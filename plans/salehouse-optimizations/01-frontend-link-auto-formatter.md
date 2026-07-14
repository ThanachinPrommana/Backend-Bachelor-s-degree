---
status: done
mode: afk
---

# Phase 1: Frontend Link Auto-formatter

**User stories**: 
- As a seller, I want to พิมพ์เพียงแค่ Line ID ลงในแบบฟอร์ม, so that ฉันไม่ต้องไปค้นหาวิธีสร้างลิงก์ Line ด้วยตัวเองให้ยุ่งยาก
- As a seller, I want to พิมพ์เพียงแค่ชื่อ Facebook ลงในแบบฟอร์ม, so that ฉันไม่ต้องไปก๊อปปี้ URL แบบเต็มๆ มาแปะให้วุ่นวาย
- As a buyer, I want to คลิกที่ปุ่มติดต่อผู้ขายผ่าน Line/Facebook ในโพสต์, so that ฉันสามารถแชทพูดคุยกับผู้ขายผ่านแอปพลิเคชันได้ทันทีโดยไม่เจอปัญหาลิงก์เสีย

## What to build

Update the `PostInform.jsx` file in the frontend to correctly identify and format Line and Facebook IDs. If a user inputs just an ID without `http` or `https`, the system should automatically prepend the correct platform URL (`https://line.me/ti/p/~` for Line, and `https://facebook.com/` for Facebook).

## Acceptance criteria

- [x] Line ID without `http/https` is converted to `https://line.me/ti/p/~<id>`
- [x] Facebook username without `http/https` is converted to `https://facebook.com/<username>`
- [x] Existing full URLs are preserved properly
- [x] No double `https://https://` formatting bugs
