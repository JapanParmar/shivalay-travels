# Database and Hosting Deployment Guide

This guide describes how to deploy your travel agency Next.js project on **Vercel** and connect it to a serverless PostgreSQL database hosted on either **Neon** or **Supabase**.

---

## 📊 Supabase vs. Neon: Which is Better?

Both are excellent, free-tier-friendly PostgreSQL hosting providers, but they serve different goals:

| Feature | Neon | Supabase |
| :--- | :--- | :--- |
| **Primary Focus** | Serverless Postgres database. | Full Backend-as-a-Service (Auth, DB, Storage). |
| **Vercel Integration** | ⚡ Native Neon integration (automatic environment setup). | ⚡ Native Supabase integration available. |
| **Scaling** | Autoscaling, database branching (like Git branches). | Standard Postgres hosting with API generation. |
| **Connection Pooling** | Built-in serverless driver & PgBouncer integration. | Built-in Connection Pooler (transaction pooler). |
| **Best Choice for Your App** | **Better Choice**: Your app already has custom admin authentication and data schemas. Neon is lightweight, extremely fast in serverless functions, and autoscales down to 0 to save free limits. | **Alternative Choice**: Great if you plan to use Supabase's built-in Auth, Storage (for images), or Real-time features in the future. |

> [!TIP]
> Since we added universal PostgreSQL support, you can switch between Neon and Supabase at any time by simply changing the `DATABASE_URL` environment variable.

---

## 🛠️ Step 1: Database Hosting Setup

### Option A: Setting up on Neon (Recommended)
1. Sign up on [Neon.tech](https://neon.tech).
2. Create a new project (e.g., `shivalay-travels`).
3. Under the **Dashboard**, copy your connection string. It will look like this:
   ```env
   postgresql://neondb_owner:xxxxxxx@ep-xxxx-xxxx-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Keep this connection string ready.

### Option B: Setting up on Supabase
1. Sign up on [Supabase.com](https://supabase.com).
2. Create a new project.
3. Once the database is ready, navigate to **Project Settings > Database**.
4. Scroll down to **Connection String** and select **URI**.
5. Copy the connection string. Choose the **Transaction Pooler** port `6543` (highly recommended for serverless hosts like Vercel) instead of the default session port `5432`:
   ```env
   postgres://postgres.xxxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
   ```
6. Replace `[YOUR-PASSWORD]` with your actual project password.

---

## ⚖️ Step 2: Vercel Configuration

### Method 1: Direct Integration (Easiest)
Vercel has official integrations for both Neon and Supabase that automatically add the environment variables for you:
1. Go to your Vercel Dashboard and click on your project.
2. Navigate to **Integrations**.
3. Search for **Neon** or **Supabase** and click **Add Integration**.
4. Link it to your Vercel project and database project. This automatically creates the `DATABASE_URL` environment variable.

### Method 2: Manual Environment Variables Setup
If you want to configure it manually:
1. Go to your project on Vercel.
2. Navigate to **Settings > Environment Variables**.
3. Add the following variable:
   - **Key**: `DATABASE_URL`
   - **Value**: *[Your connection string copied in Step 1]*
4. Click **Save**.

---

## 🔒 Step 3: Local Environment Setup (Optional)
To test PostgreSQL locally, you can add the connection string to your local `.env.local` file:
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

> [!NOTE]
> If `DATABASE_URL` is present in `.env.local`, the application will connect to PostgreSQL.
> If it's missing, the application will fallback to your local MySQL settings, and if MySQL is not available, it will fallback to the JSON file database (`data/db_fallback.json`). This ensures your application remains functional in any environment.

---

## ⚡ Automated Schema Initialization
No manual SQL script executions are required! When the application runs for the first time on Vercel:
1. The app detects the `DATABASE_URL`.
2. It establishes a PostgreSQL connection pool.
3. It automatically verifies and creates the necessary tables (`admin_users`, `bookings`, `cities`, `settings`) if they don't exist.
4. It inserts the default seed data (admin users, list of default cities, business settings).
