import type { CollectionConfig } from "payload/types";

import richText from "../../fields/richText";
import { tenant } from "../../fields/tenant";
import { tenants } from "../Shared/access/tenants";
import { loggedIn } from "../Shared/access/loggedIn";
import { tenantAdmins } from "../Shared/access/tenantAdmins";

export const Heros: CollectionConfig = {
  slug: "heros",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "image", "updatedAt"],
  },
  access: {
    read: tenants,
    create: loggedIn,
    update: tenantAdmins,
    delete: tenantAdmins,
  },
  fields: [
    {
      name: "titulo",
      label: "Titulo",
      index: true,
      type: "text",
    },
    {
      name: "subtitulo",
      label: "Subtitulo",
      index: true,
      type: "text"
    },
    {
      name: "imagen",
      label: "Imagen",
      type: "upload",
      relationTo: "media",
    },
    tenant,
    richText(),
  ],
};
