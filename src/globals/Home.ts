import { isSuperAdmin } from "../utilities/isSuperAdmin";
import { tenantAdmins } from "../collections/Shared/access/tenantAdmins";
import type { GlobalConfig } from "payload/types";

export const Home: GlobalConfig = {
  access: {
    read: ({ req: { user } }) => {
      return (
        (!user?.lastLoggedInTenant?.id && isSuperAdmin(user)) || {
          // list of documents
          tenant: {
            equals: user?.lastLoggedInTenant?.id,
          },
        }
      );
    },
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
  ],
  slug: "Home",
  label: "Home",
};
