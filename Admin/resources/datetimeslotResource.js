// server/Admin/resources/userResource.js
import { getModelByName } from "@adminjs/prisma";
import prisma from "../../config/prisma.js";

export const datetimeslotResource = {
    resource: { model: getModelByName("DateTimeSlot"), client: prisma },
    options: {
        navigation: null,
        name: "ตารางนัดหมาย",
        actions: {
            list: { isVisible: false },
            show: { isVisible: false },
            edit: { isVisible: false },
            new: { isVisible: false },
            delete: { isVisible: false },
        },
    },
};