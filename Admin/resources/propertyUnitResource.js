// server/Admin/resources/userResource.js
import { getModelByName } from "@adminjs/prisma";
import prisma from "../../config/prisma.js";
import { Components } from "../componentLoader.js";

export const propertyUnitResource = {
    resource: { model: getModelByName("PropertyUnit"), client: prisma },
    options: {
        
        navigation: "โพสต์",
        name: "ยูนิต / เลขที่บ้าน",
        listProperties: [
            'id',
            'Unit_Number',
            'Status',
            'propertyPost', // 👈 สำคัญมาก!
        ],
        actions: {
            new: { isAccessible: false },
            edit: { isAccessible: false },
            delete: { isAccessible: false },
            bulkDelete: { isAccessible: false },
            list: {
                component: Components.PropertyUnitListComponent
            },
            show: {
                component: false,
            },


        },
        properties: {
            Status: {
                availableValues: [
                    { value: 'AVAILABLE', label: 'ว่าง' },
                    { value: 'PENDING', label: 'กำลังดำเนินการ' },
                    { value: 'SOLD', label: 'ขายแล้ว' },
                ],
            },
        },
    },
};