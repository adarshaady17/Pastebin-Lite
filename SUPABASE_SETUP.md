# Supabase Database Setup Guide

## Connection String Format

For Supabase, you need to use the correct connection string format in your `.env` file.

### Option 1: Using Connection Pooling (Recommended for Serverless)

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

### Option 2: Direct Connection (For Migrations)

```env
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### Option 3: Simple Format (If above don't work)

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## How to Get Your Connection Strings

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Under **Connection string**, you'll find:
   - **URI** (for direct connection)
   - **Connection pooling** (for pooled connection)

## Important Notes

- Replace `[PROJECT-REF]` with your actual Supabase project reference
- Replace `[YOUR-PASSWORD]` with your database password
- Replace `[REGION]` with your Supabase region (e.g., `us-east-1`)
- For serverless (Vercel), use the **pooled connection** (port 6543)
- For local development and migrations, you can use the **direct connection** (port 5432)

## Example .env File

```env
# Supabase Connection (Pooled - for application)
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Supabase Direct Connection (for migrations)
DIRECT_URL="postgresql://postgres:your-password@db.abcdefghijklmnop.supabase.co:5432/postgres"

# Your application URL
BASE_URL="http://localhost:3000"
```

## Troubleshooting

### Error: "Tenant or user not found"
- Check that your password is correct
- Verify the project reference is correct
- Make sure you're using the right connection string format

### Error: "Connection timeout"
- Check your network/firewall settings
- Verify the port number (6543 for pooled, 5432 for direct)
- Ensure your IP is allowed in Supabase (if IP restrictions are enabled)

### Error: "SSL connection required"
- Add `?sslmode=require` to your connection string if needed
- Supabase usually handles SSL automatically, but some configurations may need it

