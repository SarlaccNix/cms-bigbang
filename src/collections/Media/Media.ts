import { CollectionConfig } from 'payload/types'
import { tenants } from '../Shared/access/tenants'
import { loggedIn } from '../Shared/access/loggedIn'
import { tenantAdmins } from '../Shared/access/tenantAdmins'
import { tenant } from '../../fields/tenant'
import { isSuperAdmin } from '../../utilities/isSuperAdmin'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/images',
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*','video/*'],
  },
  access: {
    read: tenants,
    create: loggedIn,
    update: tenantAdmins,
    delete: tenantAdmins,
  },
  fields: [
    tenant
  ],
}
