# Multi-Tenant CMS

A multi-tenant content management system built with [PayloadCMS](https://github.com/payloadcms/payload). This CMS supports multiple tenants with domain-based routing, tenant-scoped content, and role-based access control.

## Features

- **Multi-tenant architecture**: Each tenant has their own domain and isolated content
- **Domain-based routing**: Automatic tenant detection based on request domain
- **Tenant-scoped content**: Users only see content belonging to their tenant
- **Role-based access control**: Super admins, tenant admins, and regular users
- **Media management**: Tenant-specific media files with automatic scoping
- **Collections**: Tenants, Users, Media, Pages, Products, and more

## Development

To spin up the project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/SarlaccNix/cms-bigbang.git
   cd cms-bigbang
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database URI and other configuration.
   
   **Optional Database Seeding**: Set `PAYLOAD_SEED=true` in your `.env` file to automatically seed the database with initial data on server startup. This creates:
   - Super admin user (`hernan@godcms.com` / `godcms`)
   - Sample tenants with domains
   - Sample tenant users
   
   ⚠️ **Warning**: Only use `PAYLOAD_SEED=true` on an empty database. Running it on an existing database will attempt to create duplicate records and may cause errors. Set it back to `false` after the initial setup.

3. **Install dependencies and run**
   ```bash
   yarn install
   yarn dev
   ```

4. **Start MongoDB**
   ```bash
   # Option 1: Using Docker
   docker-compose up mongo
   
   # Option 2: Local MongoDB
   mongod --port 27017
   ```

5. **Access the admin panel**
   - Super Admin: [http://localhost:3001/admin](http://localhost:3001/admin)
   - Tenant domains: Configure domains in your tenant records and access via those URLs

6. **Create your first super admin user** using the form on the admin page

That's it! Changes made in `./src` will be reflected in your app.

## Multi-Tenant Setup

### Creating Tenants

1. **Login as Super Admin** at [http://localhost:3001/admin](http://localhost:3001/admin)

2. **Create a new tenant**:
   - Go to Collections → Tenants
   - Click "Create New"
   - Set a name (e.g., "ABC Company")
   - Add domain(s) (e.g., "abc.localhost.com:3001")

3. **Create tenant users**:
   - Go to Collections → Users
   - Create users and assign them to tenants with appropriate roles (admin/user)

4. **Access tenant admin**: Navigate to the tenant domain to access their isolated admin panel

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this project locally:

1. Follow steps 1 and 2 from the development setup above
2. Run `docker-compose up`
3. Follow steps 5 and 6 to access the admin and create your first user

The Docker instance will help you get up and running quickly while standardizing the development environment.

## Architecture

### Collections

- **Tenants**: Manage tenant organizations and their domains
- **Users**: User accounts with role-based access and tenant assignments
- **Media**: Tenant-scoped file uploads and media management
- **Pages**: Website pages with tenant-specific content
- **Products**: Product catalog with tenant isolation
- **Contact Us**: Contact forms and inquiries per tenant

### Access Control

- **Super Admin**: Full access to all tenants and global settings
- **Tenant Admin**: Full access within their assigned tenant
- **Tenant User**: Limited access within their assigned tenant

### Key Features

- Domain-based tenant detection
- Automatic content scoping based on current tenant
- Tenant-specific media isolation
- Role-based field and collection access
- Multi-tenant user management

## Production

To run in production:

1. **Build the application**:
   ```bash
   yarn build
   ```

2. **Serve in production**:
   ```bash
   yarn serve
   ```

3. **Environment Variables**:
   - Set `NODE_ENV=production`
   - Configure `DATABASE_URI` for your production MongoDB
   - Set a secure `PAYLOAD_SECRET`

### Deployment

Deploy to your preferred hosting platform. Ensure:
- MongoDB database is accessible
- Environment variables are properly configured
- DNS/domains are configured for tenant routing

## Questions

For issues or questions about PayloadCMS, reach out on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
