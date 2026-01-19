# Deployment Guide: Roommates India

Follow these steps to deploy your application to Vercel.

## 1. Prerequisites
- A GitHub repository with your code.
- A Vercel account.
- Your Supabase database connection strings.

## 2. Setting Up Environment Variables
When creating a new project on Vercel, navigate to **Settings > Environment Variables** and add the following:

| Name | Description | Example/Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Supabase Connection String (Transaction) | `postgresql://...` |
| `DIRECT_URL` | Supabase Connection String (Session) | `postgresql://...` |
| `AUTH_SECRET` | Used for NextAuth session encryption | Run `npx auth secret` to generate |
| `NEXTAUTH_URL` | Your production domain | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Same as NEXTAUTH_URL | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://...supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | `eyJhbGci...` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics Measurement ID | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN URL | `https://...@...ingest.sentry.io/...` |

## 3. Deployment Steps
1.  **Import Project**: In Vercel, click "New Project" and import your GitHub repository.
2.  **Configure Environment Variables**: Expand the "Environment Variables" section and paste the values above.
3.  **Build & Deploy**: Click "Deploy". Vercel will automatically run `npm run build` (which now correctly generates the Prisma client) and serve your app.

## 4. Post-Deployment
- Verify your sitemap at `your-domain.com/sitemap.xml`.
- Trigger a test error at `your-domain.com/sentry-test` to confirm Sentry is working.
- Check Google Analytics to see your real-time traffic.
