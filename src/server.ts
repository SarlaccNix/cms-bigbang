import express from 'express'
import payload from 'payload'
import { seed } from './seed'
import homeEndpoint from './routes/homeRoute'
import productoEndpoint from './routes/productoRoutes'
import contactoEndpoint from './routes/contacto-route'
import { checkUserRoles } from './utilities/checkUserRoles'

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
      // Middleware to restrict GraphQL access to super admins only
      app.use('/api/graphql*', async (req, res, next) => {
        try {
          const user = req.user || (req as any).payloadAPI?.user;
          if (!user || !checkUserRoles(['super-admin'], user)) {
            return res.status(403).json({ 
              error: 'Access denied. Super admin privileges required.' 
            });
          }
          next();
        } catch (error) {
          return res.status(403).json({ 
            error: 'Access denied. Super admin privileges required.' 
          });
        }
      });

      app.use(homeEndpoint);
      app.use(productoEndpoint);
      app.use(contactoEndpoint);
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  });

   if (process.env.PAYLOAD_SEED === 'true') {
     payload.logger.info('---- SEEDING DATABASE ----')
     await seed(payload);
   }

  // Add your own express routes here

  app.listen(process.env.PORT || 3001)
}

start()
