// routes/user.merged.js (ESM, merged & normalized)
import express from "express";
import upload from "../Middlewares/upload.js"; // images / generic single-file
import uploadDocument from "../Middlewares/document.js"; // user documents
import { isAuthenticated, isSeller } from "../Middlewares/authCheck.js";

const router = express.Router();

// Controllers
import {
  // Admin / Management
  updateStatusSeller,
  deleteUser,

  // Lists / Search
  listUserSeller,
  listUserBuyer,
  searchFiltersSeller,

  // Profiles (read)
  getUserProfile,
  getSellerProfile,

  // Profiles (self update)
  updateUser,
  updateSeller,
  updateimage,

  // Seller posts management (self)
  getpostBySeller,
  deletePostBySeller,

  // Deposits
  createdeposite,
  getdeposits,
  updateDepositStatus,

  // Documents
  useruploadDocument,

  // Booking & Slots
  createBooking,
  createDateTimeSlot,
  removeTimeSlot,
  removeBooking,
  uploadFinalSlip,
  confirmedSlipBySeller,
  searchFilterDateTimeSlot,
} from "../controllers/user.js";

import { createStripePaymentIntent } from "../controllers/payment.js";

// -------------------------------------------------------------
// Admin / Management (consider adding adminOnly middleware)
// -------------------------------------------------------------

// Update Seller status (APPROVED/REJECTED/PENDING)
router.patch("/seller/:sellerId/status", isAuthenticated, updateStatusSeller);
// Back-compat alias (old route): /seller/status/:id
router.patch("/seller/status/:id", isAuthenticated, (req, res, next) => {
  // Map old :id to new :sellerId
  req.params.sellerId = req.params.id;
  return updateStatusSeller(req, res, next);
});

// Delete user
router.delete("/user/:id", isAuthenticated, deleteUser);
// Back-compat alias (old route): /seller/:id (dangerous name). Keep for compatibility.
router.delete("/seller/:id", isAuthenticated, deleteUser);

// -------------------------------------------------------------
// Lists / Search
// -------------------------------------------------------------

router.get("/userSeller", listUserSeller);
router.get("/userBuyer", listUserBuyer);

// Search seller's own posts (requires login & seller)
router.get("/search/post/seller", isAuthenticated, searchFiltersSeller);
// Back-compat alias (old route used POST):
router.post("/search/filters/seller", isAuthenticated, searchFiltersSeller);

// -------------------------------------------------------------
// Profiles (read-only by id)
// -------------------------------------------------------------

router.get("/profileseller/:id", getSellerProfile); // alias name
router.get("/seller/profile/:id", getSellerProfile); // back-compat
router.get("/profile/:id", getUserProfile); // buyer profile by id

// -------------------------------------------------------------
// Profiles (self update)
// -------------------------------------------------------------

// Update buyer/user profile (User + Buyer)
router.patch("/profile", isAuthenticated, updateUser);

// Update combined profile (User + Buyer + Seller) — only for Seller
router.patch("/profileseller", isAuthenticated, updateSeller);
router.patch("/seller/profile", isAuthenticated, updateSeller); // back-compat

// Update profile image
router.post("/image", isAuthenticated, upload.single("image"), updateimage);

// -------------------------------------------------------------
// Seller posts management (self)
// -------------------------------------------------------------

// Get seller's own posts
router.get("/post/seller", isAuthenticated, getpostBySeller);
router.get("/seller/posts/:id", isAuthenticated, getpostBySeller); // back-compat

// Delete a post owned by seller
router.delete(
  "/seller/remove/post/:postId",
  isAuthenticated,
  deletePostBySeller
);
router.delete("/seller/post/:id", isAuthenticated, (req, res, next) => {
  // map old :id to new :postId
  req.params.postId = req.params.id;
  return deletePostBySeller(req, res, next);
});

// -------------------------------------------------------------
// Deposits
// -------------------------------------------------------------

router.post("/user/create/deposit", isAuthenticated, createdeposite);
router.get("/deposit", isAuthenticated, getdeposits);
router.patch(
  "/update/status/deposit/:depositId",
  isAuthenticated,
  updateDepositStatus
);

// -------------------------------------------------------------
// Documents
// -------------------------------------------------------------

router.post(
  "/document",
  isAuthenticated,
  uploadDocument.single("document"),
  useruploadDocument
);

// -------------------------------------------------------------
// DateTime Slots & Booking
// -------------------------------------------------------------

// Create slots (seller only)
router.post("/seller/slot", isAuthenticated, isSeller, createDateTimeSlot);
// Remove a slot (seller)
router.delete("/seller/remove/:timeSlotId", isAuthenticated, removeTimeSlot);
// Search seller slots
router.post("/search/slot/seller", isAuthenticated, searchFilterDateTimeSlot);

// Booking
router.post("/user/booking", isAuthenticated, createBooking);
router.delete("/user/remove/:bookingId", isAuthenticated, removeBooking);

// Final payment slip upload (buyer)
router.post(
  "/upload-final-slip/:bookingId",
  isAuthenticated,
  upload.single("finalSlip"),
  uploadFinalSlip
);
// Seller confirms final slip
router.post(
  "/confirmed-slip/:bookingId",
  isAuthenticated,
  confirmedSlipBySeller
);

// -------------------------------------------------------------
// Stripe Payments
// -------------------------------------------------------------
router.post("/create/payment", isAuthenticated, createStripePaymentIntent);

export default router;
