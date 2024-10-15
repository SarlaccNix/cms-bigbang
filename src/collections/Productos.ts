import { tenantAdmins } from "./Users/access/tenantAdmins";
import { tenant } from "../fields/tenant";
import type { CollectionConfig } from "payload/types";
import { loggedIn } from "./Shared/access/loggedIn";
import { tenants } from "./Shared/access/tenants";

export const Productos: CollectionConfig = {
    slug: "productos",
    access: {
        read: tenants,
        create: loggedIn,
        update: tenantAdmins,
        delete: tenantAdmins,
    },
    labels: {
        singular: "Producto",
        plural: "Productos"
    },
    fields: [
        {
            name: "imagen",
            label: "Imagen del producto",
            type: "upload",
            relationTo: "media",
        },
        {
            name: "titulo",
            label: "Titulo del producto",
            type: "text",
        },
        {
            name: "Descripcion",
            label: "Descripcion",
            type: "text",
        },
        tenant
    ],
};
