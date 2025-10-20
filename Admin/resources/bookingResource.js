// server/Admin/resources/userResource.js
import { getModelByName } from "@adminjs/prisma";
import prisma from "../../config/prisma.js";

export const bookingResource = {
    resource: { model: getModelByName("Booking"), client: prisma },
    options: {
        navigation:null,
        name: "การจอง",
        actions: {
            list: { isVisible: false },
            show: { isVisible: false },
            edit: { isVisible: false },
            new: { isVisible: false },
            delete: { isVisible: false },
        },
    },
};