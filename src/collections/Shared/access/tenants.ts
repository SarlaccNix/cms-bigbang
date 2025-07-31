import type { Access } from 'payload/types'

import { isSuperAdmin } from '../../../utilities/isSuperAdmin'

export const tenants: Access = async ({ req: { user, payload, headers }, data }) => {
  // Super admin gets full access
  if (isSuperAdmin(user)) {
    return true
  }

  // Get current tenant from domain
  const currentTenant = await payload.find({
    collection: 'tenants',
    where: {
      'domains.domain': {
        in: [headers.host],
      },
    },
    depth: 0,
    limit: 1,
  }).then(res => res.docs?.[0])

  if (!currentTenant) {
    return false
  }

  // For individual documents, check if current tenant matches document's tenant
  if (data?.tenant?.id) {
    return currentTenant.id === data.tenant.id
  }

  // For list of documents, filter by current tenant
  return {
    tenant: {
      equals: currentTenant.id,
    },
  }
}
