import express from 'express'
import payload from 'payload'
import { seed } from './seed'
import homeEndpoint from './routes/homeRoute'
import productoEndpoint from './routes/productoRoutes'
import contactoEndpoint from './routes/contacto-route'

require('dotenv').config()
const app = express()

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      app.use(homeEndpoint);
      app.use(productoEndpoint);
      app.use(contactoEndpoint);
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  });

  // if (process.env.PAYLOAD_SEED === 'true') {
  //   payload.logger.info('---- SEEDING DATABASE ----')
  //   await seed(payload);
  // }

  // Add your own express routes here

  app.listen(3000)
}

start()
