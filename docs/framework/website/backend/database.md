# Database Guide

This guide covers database integration, configuration, and best practices for your application's backend.

## Database Options

### 1. SQL Databases

#### PostgreSQL with Prisma

1. **Install Dependencies**:
   ```bash
   npm install @prisma/client
   npm install -D prisma
   ```

2. **Initialize Prisma**:
   ```bash
   npx prisma init
   ```

3. **Configure `schema.prisma`**:
   ```prisma
   // schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
}
   ```

4. **Environment Variables (`.env`)**
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
   ```

5. **Generate and Migrate**:
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Use in Your Application**:
   ```typescript
   // lib/db.ts
   import { PrismaClient } from '@prisma/client'
   
   const globalForPrisma = global as unknown as { prisma: PrismaClient }
   
   export const prisma = globalForPrisma.prisma || new PrismaClient()
   
   if (process.env.NODE_ENV !== 'production') {
     globalForPrisma.prisma = prisma
   }
   
   export default prisma
   ```

### 2. NoSQL Databases

#### MongoDB with Mongoose

1. **Install Dependencies**:
   ```bash
   npm install mongoose
   ```

2. **Create a Connection**:
   ```typescript
   // lib/mongodb.ts
   import mongoose from 'mongoose'
   
   const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdb'
   
   if (!MONGODB_URI) {
     throw new Error('Please define the MONGODB_URI environment variable')
   }
   
   let cached = global.mongoose
   
   if (!cached) {
     cached = global.mongoose = { conn: null, promise: null }
   }
   
   async function dbConnect() {
     if (cached.conn) {
       return cached.conn
     }
     
     if (!cached.promise) {
       const opts = {
         bufferCommands: false,
       }
       
       cached.promise = mongoose.connect(MONGODB_URI, opts)
     }
     
     try {
       cached.conn = await cached.promise
     } catch (e) {
       cached.promise = null
       throw e
     }
     
     return cached.conn
   }
   
   export default dbConnect
   ```

3. **Define a Model**:
   ```typescript
   // models/User.ts
   import mongoose from 'mongoose'
   
   const userSchema = new mongoose.Schema({
     name: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true },
     createdAt: { type: Date, default: Date.now },
   })
   
   export default mongoose.models.User || mongoose.model('User', userSchema)
   ```

## Database Connection Management

### Connection Pooling

#### PostgreSQL

```typescript
// lib/db.ts
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const res = await client.query(text, params)
    return res
  } finally {
    client.release()
  }
}
```

### Connection Retry Logic

```typescript
async function connectWithRetry(retries = 5, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      console.log('Database connected successfully')
      return connection
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error.message)
      if (i === retries - 1) throw error
      await new Promise(res => setTimeout(res, delay * (i + 1)))
    }
  }
}

// Usage
connectWithRetry().catch(err => {
  console.error('Failed to connect to database after retries:', err)
  process.exit(1)
})
```

## Database Migrations

### Prisma Migrate

```bash
# Create a new migration
npx prisma migrate dev --name add_user_profile

# Apply pending migrations in production
npx prisma migrate deploy

# Reset the database
npx prisma migrate reset
```

### Manual SQL Migrations

Create a `migrations` directory and use a migration tool like `db-migrate` or `knex`:

```bash
# Install db-migrate
npm install -g db-migrate db-migrate-pg

# Create a new migration
db-migrate create add-users-table

# Run migrations
db-migrate up
```

## Database Seeding

### Prisma Seeding

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.user.deleteMany({})
  
  // Create test users
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'User One',
      posts: {
        create: [
          { title: 'First Post', content: 'Hello World!', published: true },
        ],
      },
    },
  })
  
  console.log({ user1 })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Run with:
```bash
npx prisma db seed
```

## Performance Optimization

### Indexing

#### PostgreSQL
```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Multi-column index
CREATE INDEX idx_posts_author_published ON posts(author_id, published);

-- Unique index
CREATE UNIQUE INDEX idx_users_username ON users(username);
```

#### MongoDB
```javascript
// Single field index
db.collection('users').createIndex({ email: 1 });

// Compound index
db.collection('posts').createIndex({ author: 1, createdAt: -1 });

// Text index for search
db.collection('articles').createIndex({ title: 'text', content: 'text' });
```

### Query Optimization

1. **Select Only Required Fields**
   ```typescript
   // Bad
   const users = await prisma.user.findMany()
   
   // Good
   const users = await prisma.user.findMany({
     select: { id: true, name: true, email: true }
   })
   ```

2. **Use Pagination**
   ```typescript
   const page = 1
   const limit = 10
   const users = await prisma.user.findMany({
     skip: (page - 1) * limit,
     take: limit,
     orderBy: { createdAt: 'desc' }
   })
   ```

3. **Eager Loading**
   ```typescript
   // Bad: N+1 problem
   const posts = await prisma.post.findMany()
   for (const post of posts) {
     const author = await prisma.user.findUnique({
       where: { id: post.authorId }
     })
   }
   
   // Good: Use include
   const posts = await prisma.post.findMany({
     include: { author: true }
   })
   ```

## Security Best Practices

1. **Use Prepared Statements**
   ```typescript
   // Bad: SQL Injection risk
   const query = `SELECT * FROM users WHERE email = '${email}'`
   
   // Good: Parameterized query
   const user = await prisma.user.findUnique({
     where: { email }
   })
   ```

2. **Least Privilege Principle**
   - Create a database user with minimal required permissions
   - Don't use the root/superuser account for the application

3. **Encrypt Sensitive Data**
   ```typescript
   import { hash, compare } from 'bcryptjs'
   
   // Hash password before saving
   const hashedPassword = await hash(password, 12)
   
   // Verify password
   const isValid = await compare(password, user.password)
   ```

4. **Connection Security**
   - Use SSL/TLS for database connections in production
   - Store connection strings in environment variables, not in code

## Backup and Recovery

### PostgreSQL Backup
```bash
# Dump database
pg_dump -U username -d dbname -f backup.sql

# Restore database
psql -U username -d dbname -f backup.sql
```

### MongoDB Backup
```bash
# Dump database
mongodump --uri="mongodb://username:password@localhost:27017/dbname" --out=/backup/path

# Restore database
mongorestore --uri="mongodb://username:password@localhost:27017/dbname" /backup/path/dbname
```

## Monitoring and Maintenance

### Query Performance

#### PostgreSQL
```sql
-- Find slow queries
SELECT query, total_exec_time, calls, mean_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- Check index usage
SELECT relname, indexrelname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan;
```

#### MongoDB
```javascript
// Enable profiling
db.setProfilingLevel(1, { slowms: 100 })

// View slow queries
db.system.profile.find({ millis: { $gt: 100 } }).sort({ ts: -1 })
```

### Regular Maintenance

1. **Update Statistics**
   ```sql
   -- PostgreSQL
   ANALYZE table_name;
   
   -- MySQL
   ANALYZE TABLE table_name;
   ```

2. **Reindex**
   ```sql
   -- PostgreSQL
   REINDEX TABLE table_name;
   
   -- MongoDB
   db.collection.reIndex()
   ```

3. **Vacuum (PostgreSQL)**
   ```sql
   -- Standard vacuum
   VACUUM table_name;
   
   -- Full vacuum (locks table)
   VACUUM FULL table_name;
   
   -- Analyze and vacuum
   VACUUM ANALYZE table_name;
   ```

## Database Versioning

### Schema Versioning with Prisma

1. **Version Control Migrations**
   ```bash
   # Generate a new migration
   npx prisma migrate dev --name add_feature_x
   
   # The migration files are stored in prisma/migrations/
   ```

2. **Migration Best Practices**
   - Keep migrations small and focused
   - Test migrations in a staging environment
   - Always backup before running migrations in production
   - Have a rollback plan

### Database as Code

Store your database schema in version control:

- PostgreSQL: `pg_dump --schema-only dbname > schema.sql`
- MySQL: `mysqldump --no-data dbname > schema.sql`
- MongoDB: Use `mongodump` for data and `mongoexport` for schema

## Conclusion

This guide covers the essential aspects of database management in your application. Always consider:

1. **Performance**: Indexing, query optimization, and connection pooling
2. **Security**: Prepared statements, least privilege, and encryption
3. **Maintenance**: Regular backups, monitoring, and updates
4. **Scalability**: Sharding, read replicas, and caching strategies

For production deployments, consider using managed database services like:
- PostgreSQL: AWS RDS, Google Cloud SQL, Azure Database for PostgreSQL
- MongoDB: MongoDB Atlas, mLab
- MySQL: AWS RDS, Google Cloud SQL, Azure Database for MySQL
