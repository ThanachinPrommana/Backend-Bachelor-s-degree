const prisma = require("../config/prisma")
//complete
exports.getuserNotifications = async (req, res) => {
    try {
        const { userId } = req.session.user
        if (!userId) {
            return res.status(400).json({ message: "Seller ID is required." })
        }
        const notification = await prisma.notification.findMany({
            where: {
                userId: userId,
                relatedProcess: "DOCUMENT_UPLOAD"
            },
        })
        res.json({
            message: "success",
            data: notification
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
