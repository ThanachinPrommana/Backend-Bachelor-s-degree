---
status: active
---

# Plan: Salehouse Optimizations

> Source PRD: `prds/2026-07-14-13-30-salehouse-optimizations.md`

## Architectural decisions

Durable decisions that apply across all phases:

- **Routes**: `/api/post/create`, `/api/post/update/:id` will not change their structure.
- **Schema**: `Image` and `Video` models remain the same, storing `secure_url`.
- **Key models**: Upload logic switches from `multer-storage-cloudinary` to local disk temp storage.
- **Background Job**: Asynchronous processing via standard Promises (no external message brokers like RabbitMQ), meaning the server will process uploads in the background and delete temporary files afterward.

## Phases

1. [01-frontend-link-auto-formatter.md](./01-frontend-link-auto-formatter.md) — Frontend Link Auto-formatter
2. [02-backend-local-upload-middleware.md](./02-backend-local-upload-middleware.md) — Backend Local Upload Middleware
3. [03-backend-async-cloudinary-upload.md](./03-backend-async-cloudinary-upload.md) — Backend Asynchronous Cloudinary Upload Job
