import { tenantAdmins } from "./Users/access/tenantAdmins";
import { tenant } from "../fields/tenant";
import type { CollectionConfig } from "payload/types";
import { loggedIn } from "./Shared/access/loggedIn";
import { tenants } from "./Shared/access/tenants";

export const Home: CollectionConfig = {
  access: {
    read: tenants,
    create: loggedIn,
    // update: tenantAdmins,
    // delete: tenantAdmins,
  },
  labels: {
    singular: "Home",
    plural: "Home"
  },
  fields: [
    {
      name: "Secciones",
      label: "Secciones",
      type: "array",
      required: false,
      labels:{
        singular: "Seccion",
        plural: "Secciones"
      },
      fields: [
        {
          name: "catalogo",
          label: "Catalogos",
          relationTo: "tituloproductos",
          type: "relationship",
        },
      ],
    },
    tenant
  ],
  slug: "home",
};
