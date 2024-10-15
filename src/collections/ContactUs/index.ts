import type { CollectionConfig } from "payload/types";

import { tenant } from "../../fields/tenant";
import { tenants } from "../Shared/access/tenants";
import { loggedIn } from "../Shared/access/loggedIn";
import { tenantAdmins } from "../Shared/access/tenantAdmins";
import payload from "payload";

export const ContactUs: CollectionConfig = {
    slug: "contact-us",
    labels: {
        plural: "Contacto",
        singular: "Contacto"
    },
    admin: {
        useAsTitle: "texto",
        defaultColumns: ["texto","updatedAt"],
    },
    access: {
        read: tenants,
        create: loggedIn,
        update: tenantAdmins,
        delete: tenantAdmins,
    },
    fields: [
        {
            name: "texto",
            label: "Texto",
            index: true,
            type: "text",
        },
        tenant,
    ],
    // hooks: {
    //     beforeChange: [
    //         async ({ req, operation }) => {
    //             if (operation === 'create') {
    //                 // Cuenta los documentos ya existentes en la colección
    //                 const existingDocs = await payload.find({
    //                     collection: 'contact-us',
    //                     limit: 1, // Solo necesita uno para validar
    //                 });

    //                 if (existingDocs.totalDocs > 0) {
    //                     throw new Error('No se pueden crear más documentos en esta colección.');
    //                 }
    //             }
    //         },
    //     ]
    // }
};
