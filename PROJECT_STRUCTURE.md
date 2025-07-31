# Project Structure Documentation

This document serves as a quick reference for the multi-tenant CMS project structure and key components.

## Root Files

- `README.md` - Project documentation and setup instructions
- `package.json` - Dependencies and scripts
- `docker-compose.yml` - Docker configuration with MongoDB service
- `yarn.lock` - Dependency lock file
- `.env.example` - Environment variables template
- `Dockerfile` - Docker container configuration

## Source Code Structure (`src/`)

### Main Configuration Files

- `src/payload.config.ts` - Main PayloadCMS configuration
- `src/server.ts` - Express server setup and seeding logic
- `src/payload-types.ts` - Generated TypeScript types

### Collections (`src/collections/`)

#### Core Collections

**Tenants** (`src/collections/Tenants/`)
- `index.ts` - Tenant collection config (name, domains)
- `access/tenantAdmins.ts` - Access control for tenant admins

**Users** (`src/collections/Users/`)
- `index.ts` - User collection with roles and tenant assignments
- `access/adminsAndSelf.ts` - Users can read/update themselves + admins
- `access/tenantAdmins.ts` - Tenant admin access control
- `hooks/loginAfterCreate.ts` - Auto-login after user creation
- `hooks/recordLastLoggedInTenant.ts` - Sets lastLoggedInTenant on login
- `utilities/checkTenantRoles.ts` - Check if user has specific tenant roles
- `utilities/isSuperOrTenantAdmin.ts` - Check if user is super or tenant admin

**Media** (`src/collections/Media/`)
- `Media.ts` - Media collection with tenant scoping and upload config

#### Content Collections

**Pages** (`src/collections/Pages/`)
- `index.ts` - Website pages with tenant scoping

**Products** (`src/collections/Productos.ts`)
- Product catalog with tenant isolation

**Product Titles** (`src/collections/ProductosTitulo/`)
- `index.ts` - Product title management

**Heroes** (`src/collections/Heros/`)
- `index.ts` - Hero sections for pages

**Home** (`src/collections/Home.ts`)
- Home page content management

**Contact Us** (`src/collections/ContactUs/`)
- `index.ts` - Contact forms and inquiries

### Shared Access Control (`src/collections/Shared/access/`)

- `tenants.ts` - **CRITICAL**: Main tenant access control logic with domain-based filtering
- `tenantAdmins.ts` - Access for tenant administrators
- `loggedIn.ts` - Basic logged-in user access
- `lastLoggedInTenant.ts` - Access based on user's last logged tenant

### Fields (`src/fields/`)

**Tenant Field** (`src/fields/tenant/`)
- `index.ts` - Reusable tenant relationship field with auto-assignment hook
- `access/tenantAdmins.ts` - Field-level access control

### Access Control (`src/access/`)

- `superAdmins.ts` - Super admin access control and field access
- `anyone.ts` - Public access (for user creation)

### Utilities (`src/utilities/`)

- `isSuperAdmin.ts` - Check if user is super admin
- `checkUserRoles.ts` - Utility to check user roles

### Routes (`src/routes/`)

- `homeRoute.ts` - Home page API routes
- `productoRoutes.ts` - Product API routes  
- `contacto-route.ts` - Contact form API routes

### Seeding (`src/seed/`)

- `index.ts` - Database seeding with super admin, tenants, and sample users

## Key Concepts & Architecture

### Multi-Tenant Architecture

1. **Domain-based tenant detection**: Each tenant has domains configured
2. **Access control inheritance**: Most collections use `tenants.ts` for access control
3. **Automatic tenant assignment**: Tenant field auto-assigns based on current user's tenant
4. **Tenant scoping**: Content is automatically filtered by tenant context

### User Roles & Access

- **Super Admin**: Full system access across all tenants
- **Tenant Admin**: Full access within their assigned tenant
- **Tenant User**: Limited access within their assigned tenant

### Critical Files for Multi-Tenancy

1. `src/collections/Shared/access/tenants.ts` - Core access control logic
2. `src/fields/tenant/index.ts` - Tenant field with auto-assignment
3. `src/collections/Users/hooks/recordLastLoggedInTenant.ts` - Domain-based tenant detection
4. `src/collections/Tenants/index.ts` - Tenant configuration

### Database Seeding

- Controlled by `PAYLOAD_SEED` environment variable
- Creates super admin, sample tenants, and test users
- **Warning**: No duplicate checking - only use on empty databases

## Common Patterns

### Adding a New Tenant-Scoped Collection

1. Import required access controls and tenant field
2. Set access control to use `tenants` for read access
3. Include the `tenant` field in the fields array
4. Configure admin interface as needed

### Access Control Pattern

```typescript
access: {
  read: tenants,        // Tenant-scoped read access
  create: loggedIn,     // Any logged-in user can create
  update: tenantAdmins, // Tenant admins can update
  delete: tenantAdmins, // Tenant admins can delete
},
```

### Field Access Pattern

```typescript
fields: [
  tenant, // Auto-assigns to current user's tenant
  // ... other fields
]
```

## Environment Variables

- `DATABASE_URI` - MongoDB connection string
- `PAYLOAD_SECRET` - Encryption secret for PayloadCMS
- `NODE_ENV` - Environment (development/production)
- `PAYLOAD_SEED` - Set to 'true' to seed database on startup
- `PORT` - Server port (defaults to 3001)

## Important Notes

- Tenant column visibility is handled by PayloadCMS admin interface
- Media files are automatically scoped to tenants via access control
- User's `lastLoggedInTenant` is set based on the domain they log in from
- Collections inherit tenant scoping through the shared access control functions