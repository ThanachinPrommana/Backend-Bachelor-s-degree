const prisma = require("../config/prisma")
//ยังไม่ใช้
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
//remove Notification complete
exports.removeNotification = async (req, res) => {
    try {
        const { notiId } = req.params
        const userId = req.session.user?.id

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized. Please log in."
            })
        }

        const notiToDelete = await prisma.notification.findUnique({
            where: {
                id: notiId
            }
        })
        if (!notiToDelete) {
            return res.status(404).json({ message: "Notification not found: ไม่พบการแจ้งเตือนนี้" });
        }


        if (notiToDelete.userId !== userId) {
            return res.status(403).json({ message: "Forbidden: คุณไม่มีสิทธิ์ลบการแจ้งเตือนนี้" });
        }

        await prisma.notification.delete({
            where: {
                id: notiId
            }
        });

        res.status(200).json({
            message: "Notification removed successfully.",
            deletedNotification: notiToDelete
        });


    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
//removeAll
exports.removeNotiAll = async (req, res) => {
    try {
        const userId = req.session.user?.id

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized. Please log in."
            });
        }
        const deleteNotifications = await prisma.$transaction(async (tx) => {

            const notiToDelete = await tx.notification.findMany({
                where: {
                    userId: userId
                }

            })
            if (notiToDelete.length > 0) {
                await tx.notification.deleteMany({
                    where: { userId: userId }
                });
            }
            return notiToDelete
        })

        res.status(200).json({
            message: `Successfully removed ${deleteNotifications.length} notifications.`,
            deletedNotifications: deleteNotifications
        })


    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
