import { CollectionConfig } from 'payload/types'
import { tenants } from '../Shared/access/tenants'
import { loggedIn } from '../Shared/access/loggedIn'
import { tenantAdmins } from '../Shared/access/tenantAdmins'
import { tenant } from '../../fields/tenant'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/images',
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*','video/*'],
  },
  access: {
    read: true,
    create: loggedIn,
    update: tenantAdmins,
    delete: tenantAdmins,
  },
  fields: [
    tenant
  ],
}
