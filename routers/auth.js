import express from 'express';
import { preRegister, login, forgotPassword, resetPassword, verifyandregister, getProfile, logout, registerSeller } from '../controllers/auth.js';
import { isAuthenticated } from '../Middlewares/authCheck.js';
import uploadNationalId from '../Middlewares/uploadNationalIdImage.js';

const router = express.Router();

router.post("/preRegister", preRegister)
router.post("/verifyandregister", verifyandregister)
router.post("/login", login)
router.post("/seller/register", isAuthenticated, uploadNationalId.single("nationalIdImage"), registerSeller)

router.post("/forgotpassword", forgotPassword)
router.post("/resetpassword", resetPassword)

router.get("/profiles/user", isAuthenticated, getProfile)
router.post("/logout", logout)

export default router;