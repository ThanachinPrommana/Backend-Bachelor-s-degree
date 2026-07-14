---
status: done
mode: afk
---

# Phase 3: Backend Asynchronous Cloudinary Upload Job

**User stories**: 
- As a seller, I want to กดปุ่มยืนยันการลงประกาศแล้วได้รับข้อความ "โพสต์สำเร็จ" ในทันที, so that ฉันไม่ต้องทนนั่งรอหน้าจอโหลดเป็นนาทีจนกว่ารูปภาพทั้งหมดจะอัปโหลดเสร็จ
- As an administrator, I want to ให้รูปภาพและวิดีโอถูกทยอยอัปโหลดแบบเบื้องหลัง (Background), so that เซิร์ฟเวอร์สามารถคืน Connection ให้กับ Client ได้เร็วขึ้นและรองรับโหลดได้มากขึ้น

## What to build

Refactor `createpost` (and update logic if necessary) in `controllers/post.js`. The endpoint must immediately save text data to the database, generate the `PropertyPost` record, and return a HTTP 201 response. Then, it triggers an un-awaited background process that iterates through the temporarily saved local files, uploads them to Cloudinary using `Promise.all`, updates the database with the real `secure_url`, and finally deletes the local temporary files.

## Acceptance criteria

- [ ] Controller returns HTTP 201 immediately after saving text data
- [ ] Background process uploads images and videos to Cloudinary concurrently
- [ ] Database is updated with the correct Cloudinary URLs after successful upload
- [ ] Temporary files are securely deleted from the local disk after the process completes
