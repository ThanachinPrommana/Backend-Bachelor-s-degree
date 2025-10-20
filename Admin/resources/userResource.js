// server/Admin/resources/userResource.js
import { getModelByName } from "@adminjs/prisma";
import prisma from "../../config/prisma.js";
import { Components } from "../componentLoader.js";

export const userResource = {
    resource: { model: getModelByName("User"), client: prisma },
    options: {
        navigation: null,
        actions: {
            list: { isVisible: false },
            show: { isVisible: false },
            edit: { isVisible: false },
            new: { isVisible: false },
            delete: { isVisible: false },
        },
    },
};