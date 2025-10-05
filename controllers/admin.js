import prisma from "../config/prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerAdmin = async (req, res) => {
    try {
        const { email, password, First_name, Last_name,Phone } = req.body
        if (!email) {
            return res.status(400).json({ message: 'Email is required!!!' })
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required!!!" })
        }
        const admin = await prisma.user.findFirst({
            where: {
                Email: email
            }
        })

        if (admin) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashpassword = await bcrypt.hash(password, 10)

        const newAdmin = await prisma.user.create({
            data: {
                First_name,
                Last_name,
                Phone,
                Email: email,
                Password: hashpassword,
                userType: "Admin"
            }
        })

        res.status(201).json({ message: "Register Admin Success", admin: newAdmin });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}