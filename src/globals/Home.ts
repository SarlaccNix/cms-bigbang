import { tenantAdmins } from "../collections/Shared/access/tenantAdmins";
import { tenants } from "../collections/Shared/access/tenants";
import type { GlobalConfig } from "payload/types";
import { tenant } from "../fields/tenant";

export const Home: GlobalConfig = {
  access: {
    read: tenants,
    update: tenantAdmins,
  },
  fields: [
    {
      name: "Hero",
      label: "Hero Section",
      relationTo: "heros",
      type: "relationship",
    },
    {
      name: "",
      label: "Projects page",
      relationTo: "pages",
      type: "relationship",
    },
    // tenant
  ],
  graphQL: {
    name: "Heros",
  },
  slug: "heros",
  typescript: {
    interface: "Heros",
  },
};
