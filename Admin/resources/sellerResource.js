// server/Admin/resources/sellerResource.js
import { getModelByName } from "@adminjs/prisma";
import prisma from "../../config/prisma.js";
import { Components } from "../componentLoader.js";

export const sellerResource = {
    resource: { model: getModelByName("Seller"), client: prisma },
    options: {
        // ⚠️ หมายเหตุ: ชื่อไฟล์ของคุณคือ userResource.js แต่โค้ดข้างในเป็น sellerResource
        // ผมจะยึดตามโค้ดข้างในว่าเป็น sellerResource นะครับ
        navigation: "ผู้ใช้",
        name: "ผู้ขาย", // เปลี่ยน name ให้ตรงกับ resource

        listProperties: [
            'Company_Name',
            'RealEstate_License',
            'Status',
            'createdAt',
            'user',
            "nationalIdImage"
        ],
        showProperties: [
            'user',
            'Company_Name',
            'RealEstate_License',
            'Status',
            'nationalIdImage',
            'createdAt',
            'updatedAt'
        ],
        editProperties: ["Status", "rejectReason"],

        // ✅ เพิ่มส่วนนี้เข้ามาเพื่อกำหนดรายละเอียดของฟิลด์
        properties: {
            Status: {
                availableValues: [
                    { value: 'PENDING', label: 'รอตรวจสอบ' },
                    { value: 'APPROVED', label: 'อนุมัติ' },
                    { value: 'REJECTED', label: 'ปฏิเสธ' },
                ],
            },
            rejectReason: {
                label: 'เหตุผลการปฏิเสธ (กรอกเฉพาะเมื่อเปลี่ยนสถานะเป็น REJECTED)',
                type: 'textarea',
                isVisible: { edit: true, show: false, list: false, filter: false },
            },
        },

        actions: {
            new: {
                isAccessible: false,
            },
            list: {
                component: Components.SellerCardList,
            },
            edit: {
                before: async (request, context) => {
                    const recordId = request.params.recordId;
                    if (recordId) {
                        const originalSeller = await prisma.seller.findUnique({
                            where: { id: recordId },
                            select: { id: true, Status: true, userId: true },
                        });
                        context.originalSeller = originalSeller;
                    }
                    return request;
                },
                after: async (response, request, context) => {
                    try {
                        const original = context.originalSeller;
                        const updated = response.record.params;

                        if (!updated || !original) return response;

                        const oldStatus = original.Status;
                        const newStatus = updated.Status;

                        if (oldStatus !== newStatus && newStatus === 'REJECTED') {
                            const userId = original.userId;
                            const reason = request.payload.rejectReason || "ข้อมูลผู้ขายถูกปฏิเสธโดยผู้ดูแลระบบ";
                            const message = `สถานะผู้ขายของคุณถูกปฏิเสธ: ${reason}`;

                            await prisma.notification.create({
                                data: {
                                    userId: userId,
                                    Title: "สถานะผู้ขายถูกปฏิเสธ",
                                    Message: message,
                                    type: "account",
                                    Status: "UNREAD",
                                    relatedProcess: "seller_rejection",
                                },
                            });
                        } else if (oldStatus !== newStatus && newStatus === 'APPROVED') {
                            // ✅ โค้ดสำหรับสร้าง Notification 'APPROVED' ที่จะเพิ่มเข้ามา
                            const userId = original.userId;
                            const title = "บัญชีผู้ขายของคุณได้รับการอนุมัติแล้ว";
                            const message = "ยินดีด้วย! บัญชีคุณถูกอนุมัติแล้ว";

                            await prisma.notification.create({
                                data: {
                                    userId: userId,
                                    Title: title,
                                    Message: message,
                                    type: "account",
                                    Status: "UNREAD",
                                    relatedProcess: "seller_approval",
                                },
                            });
                        }
                    } catch (err) {
                        console.error("sellerResource.edit.after error:", err);
                    }
                    return response;
                },
            },
        },
    },
};