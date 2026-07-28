---
status: done
mode: afk
---

# Phase 2: Backend Local Upload Middleware

**User stories**: 
- As a seller, I want to กดปุ่มยืนยันการลงประกาศแล้วได้รับข้อความ "โพสต์สำเร็จ" ในทันที, so that ฉันไม่ต้องทนนั่งรอหน้าจอโหลดเป็นนาทีจนกว่ารูปภาพทั้งหมดจะอัปโหลดเสร็จ

## What to build

Modify the `Middlewares/propertyUploader.js` file to replace `CloudinaryStorage` with standard `multer.diskStorage()`. Ensure files are temporarily stored in a `/tmp/uploads` or local server directory. Validation limits for file types and sizes must remain intact.

## Acceptance criteria

- [x] `multer-storage-cloudinary` is replaced by `multer.diskStorage()`
- [x] Uploaded files are saved to a temporary local folder
- [x] File type and size limits are enforced
