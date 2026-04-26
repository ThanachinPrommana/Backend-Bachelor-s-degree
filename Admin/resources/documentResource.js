// server/Admin/resources/userResource.js
import { getModelByName } from "@adminjs/prisma";
import prisma from "../../config/prisma.js";
import { Components } from "../componentLoader.js";

export const documentResource = {
    resource: { model: getModelByName("DocumentUpload"), client: prisma },
    options: {
        sort: {
            sortBy: 'createdAt', // เรียงตาม field 'createdAt'
            direction: 'desc',   // เรียงจากมากไปน้อย (ล่าสุดอยู่บน)
        },
        navigation: "เอกสาร",
        name: "เอกสารที่อัปโหลด",
        listProperties: [
            'id',
            'DocumentName',
            'DocumentUrl',
            'Review_Status',
            'createdAt',
            'User',
        ],
        actions: {
            new: { isAccessible: false },
            edit: { isAccessible: false },
            delete: { isAccessible: false },
            bulkDelete: { isAccessible: false },
            list: {
                component: Components.DocumentCardList,
            },
            show: { isVisible: false }, // ซ่อนหน้ารายละเอียดไปเลย
        },
        properties: {
            Review_Status: {
                availableValues: [
                    { value: 'PENDING', label: 'รอตรวจสอบ' },
                    { value: 'APPROVED', label: 'อนุมัติแล้ว' },
                    { value: 'REJECTED', label: 'ถูกปฏิเสธ' },
                    { value: "HIDDEN", label: "ซ้อน" }
                ],
            },
        },
    },
};