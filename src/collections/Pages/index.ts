import type { CollectionConfig } from 'payload/types'

import richText from '../../fields/richText'
import formatSlug from './hooks/formatSlug'
import { tenant } from '../../fields/tenant'
import { loggedIn } from '../Shared/access/loggedIn'
import { tenantAdmins } from '../Shared/access/tenantAdmins'
import { tenants } from '../Shared/access/tenants'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: tenants,
    create: loggedIn,
    update: tenantAdmins,
    delete: tenantAdmins,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
    },
    tenant,
    richText(),
  ],
}
