import { tenantAdmins } from "../collections/Users/access/tenantAdmins";
import { tenant } from "../fields/tenant";
import type { CollectionConfig } from "payload/types";
import { loggedIn } from "../collections/Shared/access/loggedIn";
import { tenants } from "../collections/Shared/access/tenants";

export const Home: CollectionConfig = {
  access: {
    read: tenants,
    create: loggedIn,
    update: tenantAdmins,
    delete: tenantAdmins,
  },
  fields: [
    {
      name: "Hero",
      label: "Hero Section",
      relationTo: "heros",
      type: "relationship",
    },
    {
      name: "Secciones",
      label: "Secciones",
      type: "array",
      required: false,
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
