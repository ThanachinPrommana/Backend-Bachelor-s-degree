import express from 'express'
import { registerAdmin } from '../controllers/admin.js'

const router = express.Router()

router.post("/register/admin",registerAdmin)

export default router