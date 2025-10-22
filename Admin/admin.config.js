import AdminJS from "adminjs";
import { Database, Resource, getModelByName } from "@adminjs/prisma";
import prisma from "../config/prisma.js";
import th from "../locales/th.js";
import { componentLoader } from "./componentLoader.js";

// 🧩 import resource configs (คุณสามารถแยกแต่ละ resource เป็นไฟล์ได้ด้วย)
import { propertyPostResource } from "./resources/propertyPostResource.js";
import { userResource } from "./resources/userResource.js";
import { sellerResource } from "./resources/sellerResource.js";
import { propertyUnitResource } from "./resources/propertyUnitResource.js";
import { depositResource } from "./resources/depositResource.js";
import { documentResource } from "./resources/documentResource.js";
import { paymentResource } from "./resources/paymentResource.js";
import { datetimeslotResource } from "./resources/datetimeslotResource.js";
import { bookingResource } from "./resources/bookingResource.js";
AdminJS.registerAdapter({ Database, Resource });

export const admin = new AdminJS({
    rootPath: "/admin",
    componentLoader,
    resources: [
        userResource,
        sellerResource,
        propertyPostResource, // ✅ ดึงค่าที่แยกไว้จากอีกไฟล์
        propertyUnitResource,
        depositResource,
        documentResource,
        paymentResource,
        datetimeslotResource,
        bookingResource,
        {
            resource: { model: getModelByName("Category"), client: prisma },
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
        },
        {
            resource: { model: getModelByName("Image"), client: prisma },
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
        },
        {
            resource: { model: getModelByName("Video"), client: prisma },
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
        },
    ],
    branding: {
        companyName: "Yuu Yenn Property",
        logo: false,
    },
    locale: {
        language: "th",
        availableLanguages: ["th"],
        translations: {
            th: th.translations,
        },
    },

});
