import type { CollectionConfig } from "payload/types";

import { tenant } from "../../fields/tenant";
import { tenants } from "../Shared/access/tenants";
import { loggedIn } from "../Shared/access/loggedIn";
import { tenantAdmins } from "../Shared/access/tenantAdmins";

export const ProductosTitulo: CollectionConfig = {
  slug: "tituloproductos",
  labels: {
    singular: "Seccion",
    plural: "Secciones"
  },
  admin: {
    useAsTitle: "titulo",
    defaultColumns: ["titulo", "subtitulo", "updatedAt"],
  },
  access: {
    read: tenants,
    create: loggedIn,
    // update: tenantAdmins,
    // delete: tenantAdmins,
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
      type: "text",
    },
    {
      name: "logo",
      label: "Logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "slider",
      label: "Slider",
      type: "array",
      required: false,
      fields: [
        {
          name: "productoImagen",
          label: "Imagen",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "productoTitulo",
          label: "Titulo",
          type: "text",
        },
      ],
    },
    tenant,
  ],
};
