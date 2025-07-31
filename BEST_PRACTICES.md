# Multi-Tenant CMS Best Practices

This document outlines coding standards, architectural patterns, and security practices for maintaining and extending this multi-tenant PayloadCMS application.

## Table of Contents

1. [Multi-Tenant Architecture](#multi-tenant-architecture)
2. [Security Guidelines](#security-guidelines)
3. [Code Organization](#code-organization)
4. [Access Control Patterns](#access-control-patterns)
5. [Database & Performance](#database--performance)
6. [Error Handling](#error-handling)
7. [Testing Strategy](#testing-strategy)
8. [Development Workflow](#development-workflow)

## Multi-Tenant Architecture

### Core Principles

**🎯 Tenant Isolation First**
- Every new collection MUST implement proper tenant scoping unless explicitly global
- Use the established `tenants.ts` access control pattern for consistency
- Always include the `tenant` field for content collections

**🔗 Domain-Based Context**
- Tenant context is determined by request domain, not user preferences
- Never hard-code tenant IDs in business logic
- Leverage the automatic tenant assignment hooks

### Adding New Collections

```typescript
// ✅ CORRECT: Proper tenant-scoped collection
export const NewCollection: CollectionConfig = {
  slug: 'new-collection',
  access: {
    read: tenants,        // Tenant-scoped read access
    create: loggedIn,     // Any authenticated user can create
    update: tenantAdmins, // Only tenant admins can modify
    delete: tenantAdmins,
  },
  fields: [
    tenant, // CRITICAL: Include tenant field for scoping
    // ... other fields
  ],
}

// ❌ WRONG: Missing tenant scoping
export const BadCollection: CollectionConfig = {
  slug: 'bad-collection',
  access: {
    read: loggedIn, // This allows cross-tenant data access!
  },
  fields: [
    // Missing tenant field - data won't be scoped!
  ],
}
```

### Tenant Field Usage

**DO:**
- Always use the imported `tenant` field from `src/fields/tenant/`
- Let the beforeChange hook handle tenant assignment automatically
- Only super admins should manually set tenant values

**DON'T:**
- Create custom tenant relationship fields
- Bypass the tenant assignment hooks
- Allow regular users to modify tenant assignments

## Security Guidelines

### Access Control

**🛡️ Defense in Depth**
- Implement access control at multiple levels: collection, field, and operation
- Use the principle of least privilege for all user roles
- Always validate tenant context in custom hooks and endpoints

**Critical Security Checks:**
```typescript
// ✅ Always verify tenant context in custom logic
const verifyTenantAccess = async (user: User, documentTenantId: string) => {
  if (isSuperAdmin(user)) return true
  
  const currentTenant = await getCurrentTenantFromDomain(req.headers.host)
  return currentTenant?.id === documentTenantId
}

// ❌ Never trust client-provided tenant IDs
const badExample = (clientTenantId: string) => {
  // This allows tenant spoofing!
  return { tenant: clientTenantId }
}
```

### Data Validation

**Input Sanitization:**
- Always validate and sanitize user inputs
- Use PayloadCMS's built-in validation where possible
- Implement custom validation for business rules

**Field-Level Security:**
```typescript
{
  name: 'sensitiveField',
  type: 'text',
  access: {
    read: superAdminFieldAccess, // Restrict sensitive data
    update: superAdminFieldAccess,
  },
  validate: (val: string) => {
    // Custom validation logic
    if (!isValidFormat(val)) {
      return 'Invalid format'
    }
    return true
  },
}
```

### Environment & Secrets

**DO:**
- Use environment variables for all configuration
- Never commit secrets to version control
- Rotate `PAYLOAD_SECRET` regularly in production
- Use strong, unique passwords for seeded accounts

**DON'T:**
- Hard-code API keys or passwords
- Use default or weak secrets in production
- Log sensitive information

## Code Organization

### File Structure Standards

**Consistency is Key:**
- Follow the established directory structure
- Group related functionality together
- Use descriptive, consistent naming conventions

**Collection Organization:**
```
src/collections/
├── CollectionName/
│   ├── index.ts           # Main collection config
│   ├── access/            # Collection-specific access controls
│   ├── hooks/             # Collection-specific hooks
│   └── utilities/         # Collection-specific utilities
```

**Import Standards:**
```typescript
// ✅ CORRECT: Organized imports
import type { CollectionConfig } from 'payload/types'

// PayloadCMS imports
import { tenants } from '../Shared/access/tenants'
import { loggedIn } from '../Shared/access/loggedIn'
import { tenant } from '../../fields/tenant'

// Local utilities
import { customValidator } from './utilities/validators'

// ❌ WRONG: Disorganized imports
import { tenant } from '../../fields/tenant'
import type { CollectionConfig } from 'payload/types'
import { customValidator } from './utilities/validators'
import { tenants } from '../Shared/access/tenants'
```

### TypeScript Best Practices

**Type Safety:**
- Always use TypeScript for new code
- Leverage PayloadCMS generated types from `payload-types.ts`
- Define custom interfaces for complex data structures

```typescript
// ✅ CORRECT: Proper typing
interface TenantUser extends User {
  lastLoggedInTenant?: {
    id: string
    name: string
  }
}

const checkTenantAccess = (user: TenantUser, tenantId: string): boolean => {
  return user.lastLoggedInTenant?.id === tenantId
}

// ❌ WRONG: Using 'any' types
const badFunction = (user: any, tenantId: any): any => {
  return user.something === tenantId
}
```

## Access Control Patterns

### Standard Access Patterns

**Collection-Level Access:**
```typescript
// Most common pattern for tenant-scoped collections
access: {
  read: tenants,        // Tenant-scoped reading
  create: loggedIn,     // Any authenticated user
  update: tenantAdmins, // Tenant admins only
  delete: tenantAdmins, // Tenant admins only
}

// For global/admin-only collections
access: {
  read: superAdmins,
  create: superAdmins,
  update: superAdmins,
  delete: superAdmins,
}
```

**Field-Level Access:**
```typescript
{
  name: 'internalNotes',
  type: 'textarea',
  access: {
    read: tenantAdmins,   // Only admins can read
    update: tenantAdmins, // Only admins can update
  },
}
```

### Custom Access Control

**When to Create Custom Access Functions:**
- Complex business logic requirements
- Multi-step validation needs
- Integration with external systems

```typescript
// ✅ CORRECT: Well-documented custom access
export const customTenantAccess: Access = async ({ req: { user, payload, headers }, data }) => {
  // Super admin always has access
  if (isSuperAdmin(user)) {
    return true
  }

  // Get current tenant from domain
  const currentTenant = await getCurrentTenant(payload, headers.host)
  if (!currentTenant) {
    return false
  }

  // Custom business logic here
  const hasPermission = await checkCustomPermission(user, currentTenant, data)
  
  return hasPermission ? {
    tenant: { equals: currentTenant.id }
  } : false
}
```

## Database & Performance

### Query Optimization

**Indexing Strategy:**
- Ensure tenant fields are indexed for performance
- Add indexes to frequently queried fields
- Monitor query performance in production

**Efficient Queries:**
```typescript
// ✅ CORRECT: Leverage PayloadCMS filtering
const results = await payload.find({
  collection: 'products',
  where: {
    tenant: { equals: tenantId },
    status: { equals: 'published' },
  },
  limit: 20,
  sort: '-createdAt',
})

// ❌ WRONG: Fetching all data and filtering in JavaScript
const allProducts = await payload.find({ collection: 'products' })
const filtered = allProducts.docs.filter(p => p.tenant === tenantId)
```

### Data Consistency

**Referential Integrity:**
- Always validate relationships between tenants and related data
- Use PayloadCMS relationship validation where possible
- Implement cleanup procedures for orphaned data

**Transaction Patterns:**
```typescript
// For complex operations that must succeed or fail together
const createTenantWithAdmin = async (tenantData: any, adminData: any) => {
  try {
    const tenant = await payload.create({
      collection: 'tenants',
      data: tenantData,
    })

    const admin = await payload.create({
      collection: 'users',
      data: {
        ...adminData,
        tenants: [{ tenant: tenant.id, roles: ['admin'] }],
      },
    })

    return { tenant, admin }
  } catch (error) {
    // Handle rollback if needed
    throw new Error('Failed to create tenant with admin')
  }
}
```

## Error Handling

### Graceful Degradation

**User-Friendly Errors:**
```typescript
// ✅ CORRECT: Helpful error messages
const validateTenantAccess = (user: User, resource: any) => {
  if (!user) {
    throw new Error('Authentication required')
  }
  
  if (!resource.tenant) {
    throw new Error('Resource is not associated with a tenant')
  }
  
  if (!canAccessTenant(user, resource.tenant)) {
    throw new Error('You do not have permission to access this resource')
  }
}

// ❌ WRONG: Generic or cryptic errors
const badValidation = (user: any, resource: any) => {
  if (!user || !resource.tenant || !canAccessTenant(user, resource.tenant)) {
    throw new Error('Access denied')
  }
}
```

### Logging Strategy

**Structured Logging:**
```typescript
// ✅ CORRECT: Structured, informative logs
payload.logger.info('Tenant access granted', {
  userId: user.id,
  tenantId: tenant.id,
  action: 'read',
  collection: 'products',
})

// ❌ WRONG: Unstructured logs
console.log('User accessed stuff')
```

**Security Logging:**
- Log all authentication events
- Log access control violations
- Never log sensitive data (passwords, tokens)

## Testing Strategy

### Test Categories

**Unit Tests:**
- Test access control functions in isolation
- Validate tenant assignment logic
- Test custom validation functions

**Integration Tests:**
- Test complete tenant isolation
- Verify domain-based routing
- Test user role transitions

**Security Tests:**
- Attempt cross-tenant data access
- Test privilege escalation scenarios
- Validate input sanitization

### Test Organization

```typescript
// ✅ CORRECT: Well-organized test structure
describe('Tenant Access Control', () => {
  describe('Super Admin Access', () => {
    test('should have access to all tenants', async () => {
      // Test implementation
    })
  })

  describe('Tenant Admin Access', () => {
    test('should only access own tenant data', async () => {
      // Test implementation
    })
  })

  describe('Cross-Tenant Security', () => {
    test('should prevent cross-tenant data access', async () => {
      // Test implementation
    })
  })
})
```

## Development Workflow

### Code Review Standards

**Pre-Review Checklist:**
- [ ] Tenant isolation properly implemented
- [ ] Access controls follow established patterns
- [ ] No hard-coded tenant IDs or sensitive data
- [ ] TypeScript types properly defined
- [ ] Error handling implemented
- [ ] Tests written for new functionality

### Database Migration Strategy

**Safe Migration Practices:**
- Always backup production data before migrations
- Test migrations on staging environment first
- Consider backward compatibility
- Document breaking changes

### Deployment Guidelines

**Production Readiness:**
- Environment variables properly configured
- Database indexes created
- Monitoring and logging enabled
- Security headers configured
- SSL/TLS properly configured

### Performance Monitoring

**Key Metrics to Track:**
- Database query performance
- Memory usage by tenant
- API response times
- Error rates by tenant
- Authentication success/failure rates

## Common Anti-Patterns to Avoid

### ❌ Tenant Context Anti-Patterns

```typescript
// DON'T: Hard-code tenant IDs
const products = await payload.find({
  collection: 'products',
  where: { tenant: { equals: 'hardcoded-tenant-id' } }
})

// DON'T: Trust client-provided tenant context
const createProduct = async (data: any) => {
  return payload.create({
    collection: 'products',
    data: {
      ...data,
      tenant: data.clientTenantId // Vulnerable to spoofing!
    }
  })
}

// DON'T: Bypass access controls
const getAllUserData = async () => {
  // This bypasses tenant scoping!
  return await db.collection('users').find({}).toArray()
}
```

### ❌ Security Anti-Patterns

```typescript
// DON'T: Store secrets in code
const config = {
  apiKey: 'sk-1234567890abcdef', // Never do this!
  dbPassword: 'password123'       // Never do this!
}

// DON'T: Overprivileged access
access: {
  read: () => true,  // This gives everyone access!
  create: () => true,
  update: () => true,
  delete: () => true,
}

// DON'T: Ignore error cases
const riskyFunction = async (userId: string) => {
  const user = await payload.findByID({ collection: 'users', id: userId })
  return user.tenants[0].tenant.id // Will crash if user has no tenants!
}
```

## Conclusion

Following these best practices ensures:
- **Security**: Proper tenant isolation and access control
- **Maintainability**: Consistent code patterns and organization
- **Performance**: Optimized queries and efficient data handling
- **Reliability**: Proper error handling and testing coverage
- **Scalability**: Architecture that grows with your needs

Remember: **When in doubt, err on the side of security and explicitness over brevity.**

---

*This document should be updated as the project evolves and new patterns emerge. All team members are responsible for maintaining these standards.*