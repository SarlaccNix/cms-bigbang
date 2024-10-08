import type { Field } from 'payload/types'

import { superAdminFieldAccess } from '../../access/superAdmins'
import { isSuperAdmin } from '../../utilities/isSuperAdmin'
import { tenantAdminFieldAccess } from './access/tenantAdmins'

export const tenant: Field = {
  name: 'tenant',
  type: 'relationship',
  relationTo: 'tenants',
  index: true,
  admin: {
    position: 'sidebar',
  },
  access: {
    create: superAdminFieldAccess,
    read: tenantAdminFieldAccess,
    update: superAdminFieldAccess,
  },
  hooks: {
    beforeChange: [
      async ({ req, req: { user }, data }) => {
        if ((await isSuperAdmin(req.user)) && data?.tenant) {
          return data.tenant
        }

        if (user?.lastLoggedInTenant?.id) {
          return user.lastLoggedInTenant.id
        }

        return undefined
      },
    ],
  },
}
