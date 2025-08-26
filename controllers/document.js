// const prisma = require("@prisma/client")
const { include } = require("params")
const prisma = require("../config/prisma")
exports.approveDocument = async (req, res) => {
    try {
        const userId = req.session.user
        
        if (!userId) {
            res.status(403).json({
                message: "Forbidden: Only sellers can approve documents."
            })
        }
        const { documentId } = req.params

        const { status } = req.body
        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }
        const documentToUpdate = await prisma.documentUpload.findUnique({
            where: { id: documentId },
            include: {
                Post: {
                    select: { userId: true }
                }
            }
        });
        if (!documentToUpdate) {
            return res.status(404).json({ message: "Document not found" });
        }
        if (documentToUpdate.Post.userId !== userId.id) {
            return res.status(403).json({ message: "Forbidden: You are not the owner of this post." });
        }


        const updateDocument = await prisma.documentUpload.update({
            where: {
                id: documentId
            }, data: {
                Review_Status: status
            },
            include: {
                User: {
                    select: {
                        id: true,
                        First_name: true
                    }
                }
            }
        })
        


        await prisma.notification.create({
            data: {
                userId: updateDocument.userId, // ID ของ Buyer
                Title: `สถานะเอกสารของคุณมีการเปลี่ยนแปลง`,
                Message: `เอกสาร "${updateDocument.DocumentName}" ของคุณได้รับการ ${status}`,
                Status: "UNREAD",
                relatedProcess: "DOCUMENT_APPROVAL",
                referenceId: updateDocument.id
            },
        });
        res.json({
            message: `Document ${status} successfully`,
            updateDocument,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
        });
    }
}
exports.getDocument = async (req, res) => {
    try {
        const { postId } = req.query
        if (req.user.userType === "Buyer") { }
    } catch (err) {

    }
}
exports.queryDocument = async (req, res) => {
    try {

    } catch (err) {

    }
}