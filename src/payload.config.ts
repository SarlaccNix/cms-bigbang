import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload/config'
import { Users } from './collections/Users'
import { Tenants } from './collections/Tenants'
import { Pages } from './collections/Pages'
import dotenv from 'dotenv'
import { Media } from './collections/Media/Media'
import { Heros } from './collections/Heros'
import { Home } from './collections/Home'
import { ProductosTitulo } from './collections/ProductosTitulo'
import { ContactUs } from './collections/ContactUs'
import { Productos } from './collections/Productos'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

export default buildConfig({
  collections: [Users, Tenants, Media, Heros, ProductosTitulo, Home, ContactUs, Productos], // Pages
  admin: {
    bundler: webpackBundler(),
    webpack: config => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          dotenv: path.resolve(__dirname, './dotenv.js'),
        },
      },
    }),
  },
  editor: slateEditor({}),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  //plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
