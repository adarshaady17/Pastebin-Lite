# Vercel Deployment Guide

This guide will walk you through deploying Pastebin Lite to Vercel.

## Prerequisites

- ✅ Git repository (GitHub, GitLab, or Bitbucket)
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
- ✅ PostgreSQL database (Supabase, Neon, or other)

## Step 1: Prepare Your Code

1. **Commit all changes**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Verify your code builds locally**
   ```bash
   npm run build
   ```

## Step 2: Set Up Database

Choose one of these options:

### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be ready
4. Go to **Settings** → **Database**
5. Copy the **Connection pooling** URL (Transaction mode)
   - Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`
6. Also copy the **URI** (Session mode) for `DIRECT_URL` if needed

### Option B: Neon

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string from the dashboard
4. Use it as your `DATABASE_URL`

## Step 3: Deploy to Vercel

### Method 1: Via Vercel Dashboard (Easiest)

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub/GitLab/Bitbucket account

2. **Import Project**
   - Click "Add New Project"
   - Select your repository
   - Vercel will auto-detect Next.js

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-set)
   - Output Directory: `.next` (auto-set)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add the following:
     ```
     DATABASE_URL = your-postgresql-connection-string
     ```
   - For Supabase, optionally add:
     ```
     DIRECT_URL = your-direct-connection-string
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)

### Method 2: Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Add environment variables when asked

## Step 4: Set Up Database Schema

After deployment, you need to create the database tables:

### Option A: Using Vercel CLI

```bash
# Link your project
vercel link

# Set environment variable locally (optional, for migrations)
export DATABASE_URL="your-connection-string"

# Push schema
npx prisma db push
```

### Option B: Using Local Machine

```bash
# Set DATABASE_URL in your local .env file
# Then run:
npx prisma db push
```

### Option C: Using Prisma Studio

```bash
# Set DATABASE_URL in your local .env file
npx prisma studio
# Use the UI to verify tables are created
```

## Step 5: Verify Deployment

1. **Check Health Endpoint**
   ```
   https://your-app.vercel.app/api/healthz
   ```
   Should return: `{"ok":true}`

2. **Test Creating a Paste**
   - Visit your deployed URL
   - Create a test paste
   - Verify the link works

3. **Test API Endpoints**
   ```bash
   # Create a paste
   curl -X POST https://your-app.vercel.app/api/pastes \
     -H "Content-Type: application/json" \
     -d '{"content":"Test paste"}'
   
   # Get the paste (use the ID from above)
   curl https://your-app.vercel.app/api/pastes/[id]
   ```

## Step 6: Configure Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 24 hours)

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `DIRECT_URL` | ❌ No | Direct connection (Supabase only) |
| `BASE_URL` | ❌ No | App URL (auto-detected) |
| `TEST_MODE` | ❌ No | Set to `1` for testing |

## Troubleshooting

### Build Fails

**Error: "Prisma Client not generated"**
- ✅ Fixed automatically via `postinstall` script
- If persists, check that `DATABASE_URL` is set

**Error: "Module not found"**
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

### Database Connection Issues

**Error: "Connection refused" or "Tenant not found"**
- Verify `DATABASE_URL` is correct
- Check database credentials
- For Supabase, ensure you're using pooled connection (port 6543)
- Verify database allows external connections

**Error: "Schema not found"**
- Run `npx prisma db push` after deployment
- Check that database exists and is accessible

### Runtime Errors

**Error: "Cannot connect to database"**
- Verify `DATABASE_URL` is set in Vercel
- Check database is running and accessible
- Verify connection string format

**Error: "Table does not exist"**
- Run `npx prisma db push` to create tables
- Or use `npx prisma migrate deploy` for production

## Post-Deployment Checklist

- [ ] Code is pushed to Git repository
- [ ] Vercel project is created and linked
- [ ] `DATABASE_URL` is set in Vercel environment variables
- [ ] Build completes successfully
- [ ] Database schema is created (`npx prisma db push`)
- [ ] Health check works (`/api/healthz`)
- [ ] Can create pastes via UI
- [ ] Can view pastes via shared links
- [ ] Max views constraint works
- [ ] TTL expiry works

## Updating Your Deployment

1. **Make changes locally**
2. **Test locally**
   ```bash
   npm run dev
   ```
3. **Commit and push**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
4. **Vercel automatically deploys** (if connected to Git)
   - Or manually trigger via Vercel dashboard
   - Or run `vercel --prod` via CLI

## Monitoring

- **Vercel Dashboard**: View deployments, logs, and analytics
- **Function Logs**: Check serverless function execution
- **Database Logs**: Check your database provider's dashboard

## Support

For issues:
1. Check Vercel build logs
2. Check function logs in Vercel dashboard
3. Verify environment variables are set
4. Test database connection locally

## Next Steps

- Set up custom domain
- Configure analytics
- Set up monitoring
- Add CI/CD workflows
- Optimize performance

