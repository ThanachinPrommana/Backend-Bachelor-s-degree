// server/Admin/resources/propertyPostResource.js
import { getModelByName } from "@adminjs/prisma";
import prisma from "../../config/prisma.js";
import { Components } from '../componentLoader.js';

export const propertyPostResource = {
    resource: { model: getModelByName("PropertyPost"), client: prisma },
    options: {
        sort: {
            sortBy: 'createdAt', // เรียงตาม field 'createdAt'
            direction: 'desc',   // เรียงจากมากไปน้อย (ล่าสุดอยู่บน)
        },
        navigation: "โพสต์",
        name: "โพสต์ขายบ้าน",
        // perPage: 3,
        listProperties: [
            'Property_Name', 'Price', 'Usable_Area', 'Land_Size',
            'Bedrooms', 'Bathroom', 'Description', 'Deposit_Amount',
            'LinkMap', 'Province', 'District', 'Subdistrict', 'Address',
            'Total_Rooms', 'Year_Built', 'Parking_Space', 'Sell_Rent',
            'Other_related_expenses', 'Link_line', 'Link_facbook',
            'Name', 'Phone', 'floor', 'NumberOfUnits',
            'Status_post', 'createdAt', 'updatedAt',
            'Category', 'user'
        ],

        showProperties: [
            "Property_Name", "Description", "Price", "Usable_Area", "Land_Size",
            "Bedrooms", "Bathroom", "floor", "NumberOfUnits", "Parking_Space",
            "Total_Rooms", "Year_Built",
            "Other_related_expenses", "Sell_Rent", "Deposit_Amount", "Province",
            "District", "Subdistrict", "Address", "LinkMap", "Link_line",
            "Link_facbook", "Name", "Phone", "Status_post",
            "Category.name", "PropertyUnit", "Image", "Video",
            "DocumentUpload", "createdAt", "updatedAt",
        ],

        editProperties: ["Status_post", "rejectReason"],

        actions: {
            new: { isAccessible: false },

            edit: {
                before: async (request, context) => {
                    const recordId = request.params?.recordId;
                    if (recordId) {
                        const original = await prisma.propertyPost.findUnique({
                            where: { id: recordId },
                            select: { id: true, Status_post: true, userId: true, Property_Name: true }
                        });
                        context._originalPropertyPost = original;
                    }
                    return request;
                },
                after: async (response, request, context) => {
                    try {
                        const original = context._originalPropertyPost;
                        // เราใช้ response.record?.params เหมือนเดิมได้
                        const updatedParams = response.record?.params;

                        if (!updatedParams || !original) {
                            return response;
                        }

                        const oldStatus = original.Status_post;
                        const newStatus = updatedParams.Status_post;
                        const referenceId = updatedParams.id || original.id;

                        if (oldStatus !== newStatus) {
                            const userId = updatedParams.userId || original.userId;
                            const propertyName = updatedParams.Property_Name || original.Property_Name;

                            if (newStatus === 'REJECTED') {
                                const reason = request.payload.rejectReason || "โพสต์ถูกปฏิเสธโดยผู้ดูแลระบบ";

                                // 1. Notification
                                await prisma.notification.create({
                                    data: {
                                        userId, referenceId,
                                        Title: "โพสต์ของคุณถูกปฏิเสธและลบ",
                                        Message: `โพสต์ "${propertyName}" ถูกปฏิเสธและถูกลบออกจากระบบ: ${reason}`,
                                        type: "post", targetUrl: '/my-posts',
                                        Status: "UNREAD", relatedProcess: "post_reject_delete",
                                    },
                                });

                                try {
                                    await prisma.propertyPost.delete({
                                        where: { id: referenceId }
                                    });

                                    // 3. Modify response ON SUCCESS (เหมือนเดิม)
                                    response.notice = {
                                        message: 'ปฏิเสธและลบโพสต์ เรียบร้อยแล้ว',
                                        type: 'success'
                                    };
                                    response.redirectUrl = context.h.resourceUrl({
                                        resourceId: context.resource.id()
                                    });

                                } catch (deleteError) {
                                    // 4. Modify response ON FAIL (เหมือนเดิม)
                                    console.error("Failed to delete post (cascade):", deleteError);
                                    response.notice = {
                                        message: `ลบโพสต์ล้มเหลว: ${deleteError.message}`,
                                        type: 'error'
                                    };
                                }

                            } else if (newStatus === 'CONFIRMED') {
                                // ... (Logic การอนุมัติของคุณเหมือนเดิม) ...
                                await prisma.notification.create({
                                    data: {
                                        userId, referenceId,
                                        Title: "โพสต์ของคุณได้รับการอนุมัติแล้ว",
                                        Message: `โพสต์ "${propertyName}" ของคุณได้รับการอนุมัติและแสดงผลบนเว็บไซต์แล้ว`,
                                        type: "post", targetUrl: `/properties/${referenceId}`,
                                        Status: "UNREAD", relatedProcess: "post_approval",
                                    },
                                });
                            }
                        }
                    } catch (err) {
                        console.error("edit.after error (outer):", err);
                        response.notice = {
                            message: `เกิดข้อผิดพลาด: ${err.message}`,
                            type: 'error'
                        };
                    }

                    // คืนค่า response ที่ถูกแก้ไข (หรือไม่ได้แก้ไข)
                    return response;
                },
            },

            list: {
                perPage: 100,
                component: Components.PropertyCardList,
                // settings: {
                //     perPage: 2, // บังคับให้แสดง 2 รายการต่อหน้า
                // },
                // ✅ แก้ไข: เหลือ after hook แค่อันเดียวที่สมบูรณ์ที่สุด
                after: async (response, request, context) => {
                    try {
                        const records = response.records || [];
                        if (records.length === 0) return response;

                        const ids = records.map(r => r.id).filter(Boolean);
                        if (ids.length === 0) return response;

                        const [images, postsWithCategory] = await Promise.all([
                            prisma.image.findMany({
                                where: { propertyPostId: { in: ids } },
                                orderBy: { createdAt: "asc" },
                            }),
                            prisma.propertyPost.findMany({
                                where: { id: { in: ids } },
                                select: {
                                    id: true,
                                    Category: { select: { id: true, name: true } },
                                },
                            }),
                        ]);

                        const imageMap = {};
                        for (const im of images) {
                            if (!imageMap[im.propertyPostId]) {
                                imageMap[im.propertyPostId] = im.secure_url || im.url || null;
                            }
                        }

                        const categoryMap = {};
                        for (const p of postsWithCategory) {
                            categoryMap[p.id] = p.Category?.name || null;
                        }

                        for (const rec of records) {
                            rec.params._firstImage = imageMap[rec.id] ?? null;
                            rec.params._categoryName = categoryMap[rec.id] ?? null;
                        }
                    } catch (err) {
                        console.error("propertyPostResource.list.after error:", err);
                    }
                    return response;
                },
                // settings: { perPage: 3 },
            },
        },

        properties: {
            Property_Name: { label: "ชื่อทรัพย์สิน" },
            Price: { label: "ราคา" },
            Usable_Area: { label: "พื้นที่ใช้สอย (ตร.ม.)" },
            Land_Size: { label: "ขนาดที่ดิน (ตร.ว.)" },
            Bedrooms: { label: "ห้องนอน" },
            Bathroom: { label: "ห้องน้ำ" },
            floor: { label: "ชั้น" },
            NumberOfUnits: { label: "จำนวนยูนิต" },
            Parking_Space: { label: "ที่จอดรถ" },
            Province: { label: "จังหวัด" },
            District: { label: "อำเภอ" },
            Subdistrict: { label: "ตำบล" },
            Address: { label: "ที่อยู่" },
            LinkMap: { label: "ลิงก์แผนที่" },
            Link_line: { label: "ลิงก์ LINE" },
            Link_facbook: { label: "ลิงก์ Facebook" },
            Name: { label: "ชื่อผู้โพสต์" },
            Phone: { label: "เบอร์โทร" },
            Deposit_Amount: { label: "เงินมัดจำ" },
            Category: { label: "หมวดหมู่" },
            createdAt: { label: "วันที่สร้าง" },
            updatedAt: { label: "แก้ไขล่าสุด" },

            // ✅ แก้ไข: รวม Status_post ไว้ในที่เดียว
            Status_post: {
                label: "สถานะโพสต์",
                availableValues: [
                    { value: 'PENDING', label: 'รอตรวจสอบ' },
                    { value: 'CONFIRMED', label: 'อนุมัติ' },
                    { value: 'SOLD', label: 'ขายแล้ว' },
                    { value: 'HIDDEN', label: 'ซ่อน' },
                    { value: 'REJECTED', label: 'ปฏิเสธ' },

                ],
            },
            Sell_Rent: {
                label: "ขาย",
                availableValues: [
                    { value: 'SELL', label: 'ขาย' },
                    { value: 'RENT', label: 'เช่า' },
                ]
            },
            rejectReason: {
                label: 'เหตุผลการปฏิเสธ (กรอกเฉพาะเมื่อเปลี่ยนสถานะเป็น REJECTED)',
                type: 'textarea',
                isVisible: { edit: true, show: false, list: false, filter: false },
            },
        },
    },
};