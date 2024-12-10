import type { Access } from 'payload/config'

import { isSuperAdmin } from '../../../utilities/isSuperAdmin'
import { isSuperOrTenantAdmin } from '@/collections/Users/utilities/isSuperOrTenantAdmin'

// the user must be an admin  of the tenant being accessed or a super admin
export const tenantAdmins: Access = ({ req: { user } }) => {
  if (isSuperOrTenantAdmin(user)) {
    return true
  }

  return {
    id: {
      in:
        user?.tenants
          ?.map(({ tenant, roles }) =>
            roles.includes('admin') ? (typeof tenant === 'string' ? tenant : tenant.id) : null,
          ) // eslint-disable-line function-paren-newline
          .filter(Boolean) || [],
    },
  }
}
