// server/Admin/resources/depositResource.js
import { getModelByName } from "@adminjs/prisma";
import prisma from "../../config/prisma.js"; // ตรวจสอบว่า path ไปยัง prisma client ถูกต้อง
import { Components } from "../componentLoader.js";

export const depositResource = {
    resource: { model: getModelByName("Deposit"), client: prisma },
    options: {
        sort: {
            sortBy: 'createdAt', // เรียงตาม field 'createdAt'
            direction: 'desc',   // เรียงจากมากไปน้อย (ล่าสุดอยู่บน)
        },
        navigation: "โพสต์",
        name: "เงินมัดจำ",

        // ✅ อัปเดต listProperties ให้ดึงข้อมูลที่จำเป็นทั้งหมด
        listProperties: [
            'id',
            'Deposit_Amount',
            'Deposit_Status',
            'createdAt',
            'Post', // Relation to PropertyPost
            'User', // Relation to User
            'Unit', // Relation to PropertyUnit
        ],

        showProperties: ['id', 'Deposit_Amount', 'Deposit_Status', 'createdAt', 'Post', 'User', 'Unit'],

        actions: {
            new: { isAccessible: false },
            edit: { isAccessible: false },
            delete: { isAccessible: false },
            bulkDelete: { isAccessible: false },
            list: {
                component: Components.DepositCardList, // ตรวจสอบว่า ID ตรงกับใน componentLoader.js
            },
            show: { component: false },
        },

        properties: {
            Deposit_Status: {
                availableValues: [
                    { value: 'PENDING', label: 'รอดำเนินการ' },
                    { value: 'CONFIRMED', label: 'ยืนยันแล้ว' },
                    { value: 'REJECTED', label: 'ถูกปฏิเสธ' },
                ],
            },
        },
    },
};