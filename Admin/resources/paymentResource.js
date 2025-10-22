// server/Admin/resources/userResource.js
import { getModelByName } from "@adminjs/prisma";
import prisma from "../../config/prisma.js";
import { Components } from "../componentLoader.js";

export const paymentResource = {
    resource: { model: getModelByName("Payment"), client: prisma },
    options: {
        navigation: "ชำระเงิน",
        name: "ข้อมูลการชำระเงิน",
        listProperties: [
            'id',
            'Payment_Amount',
            'Payment_Slip',
            'Status',
            'createdAt',
            'User',
            'PropertyPost'
        ],
        actions: {
            new: { isAccessible: false },
            edit: { isAccessible: false },
            delete: { isAccessible: false },
            bulkDelete: { isAccessible: false },
            show: { isVisible: false }, // ซ่อนปุ่ม "ดูรายละเอียด"
            list: {
                component: Components.PaymentCardList,
            },
        },
        properties: {
            Status: {
                availableValues: [
                    { value: 'PENDING', label: 'รอตรวจสอบ' },
                    { value: 'CONFIRMED', label: 'ยืนยันแล้ว' },
                    { value: 'REJECTED', label: 'ปฏิเสธ' },
                ],
            },
        },
    },
};