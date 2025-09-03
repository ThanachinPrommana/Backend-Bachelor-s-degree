// const prisma = require("@prisma/client")
const { include } = require("params")
const prisma = require("../config/prisma")
//complete
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
//complete ยังไม่ใช้
exports.getDocument = async (req, res) => {
    try {
        const userId = req.session.user.id
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
        const Document = await prisma.documentUpload.findMany({
            where: {
                userId: userId
            },
            select: {
                id: true,
                DocumentName: true,
                Review_Status: true,
                DocumentUrl: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        res.json(Document)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
}
//complete
const handlequeryDoc = async (req, res, query) => {
    try {
        // 1. กำหนดค่าสถานะที่เป็นไปได้ทั้งหมด (ควรตรงกับใน schema.prisma)
        const validStatuses = ["PENDING", "APPROVED", "REJECTED"]; 

        // 2. สร้างเงื่อนไข where clause พื้นฐาน
        const whereClause = {
            OR: [
                {
                    DocumentName: {
                        contains: query,
                        mode: "insensitive"
                    }
                }
            ]
        };

        // 3. ตรวจสอบว่า query ที่รับมาเป็นหนึ่งในสถานะที่ถูกต้องหรือไม่
        
        if (validStatuses.includes(query.toUpperCase())) {
            
            whereClause.OR.push({
                Review_Status: {
                    equals: query.toUpperCase() 
                }
            });
        }

        
        const doc = await prisma.documentUpload.findMany({
            where: whereClause, 
            select: {
                id: true,
                DocumentName: true,
                Review_Status: true,
                DocumentUrl: true
            }
        });

        res.json({ doc });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}
//complete
exports.searchDocument = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
        const { q } = req.body
        console.log("q:", q)
        if (q) {
            await handlequeryDoc(req, res, q);
        } else {
            return res.json([]);
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}