import type { CollectionConfig } from 'payload/types'

import { superAdmins } from '../../access/superAdmins'
import { tenantAdmins } from './access/tenantAdmins'
import { lastLoggedInTenant } from '../Shared/access/lastLoggedInTenant'
import { isSuperAdmin } from '../../utilities/isSuperAdmin'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: superAdmins,
    read: ({ req: { user }, data }) => 
      isSuperAdmin(user) || (user?.lastLoggedInTenant?.id === data?.id),
    update: superAdmins,
    delete: superAdmins,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'domains',
      type: 'array',
      index: true,
      fields: [
        {
          name: 'domain',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
