# Napa Valley Marathon Training Tracker

An 8-week marathon training tracker for the Napa Valley Marathon (March 1, 2026). Built with Next.js 16, Vercel Postgres, and Drizzle ORM.

![Dark Athletic Theme](https://img.shields.io/badge/theme-dark%20athletic-0a0a0a)
![Next.js 14](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **Today View**: Quick overview of today's workout with one-tap completion logging
- **Week View**: 7-day view with progress tracking and weekly totals
- **Calendar View**: Month-at-a-glance with workout type indicators
- **Stats Dashboard**: Weekly mileage charts, completion streaks, long run progression
- **Completion Modal**: Log actual miles, duration, RPE, notes, and fueling (for long runs)
- **Mobile-First**: Optimized for daily use on your phone with bottom navigation
- **PWA Support**: Install on your home screen for app-like experience

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Vercel Postgres
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Fonts**: Geist Sans + Geist Mono

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs in offline mode with local data when no database is connected.

## Deployment to Vercel

### 1. Create Vercel Project

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project (from the marathon-tracker directory)
cd marathon-tracker
vercel link
```

### 2. Create Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Storage** tab
4. Click **Create Database** → **Postgres**
5. Name it `marathon-tracker-db`
6. The environment variables will be automatically added

### 3. Deploy

```bash
# Deploy to production
vercel --prod
```

### 4. Seed the Database

After the first deployment, seed the database with the training plan:

```bash
# Pull environment variables locally
vercel env pull .env.local

# Run seed script
npm run db:seed
```

The seed script creates the tables and inserts all 56 workout days.

## Environment Variables

Required for production:
- `POSTGRES_URL` - Vercel Postgres connection string (auto-configured)

## Database Schema

```sql
-- Workout plan (seeded from plan data)
CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  day_of_week VARCHAR(3) NOT NULL,
  week_number INT NOT NULL,
  miles_planned DECIMAL(4,1) NOT NULL,
  workout_type VARCHAR(20) NOT NULL,
  workout_description TEXT NOT NULL,
  is_taper_week BOOLEAN DEFAULT FALSE,
  is_long_run BOOLEAN DEFAULT FALSE,
  is_race_day BOOLEAN DEFAULT FALSE
);

-- User completion logs
CREATE TABLE completions (
  id SERIAL PRIMARY KEY,
  workout_id INT REFERENCES workouts(id),
  completed_at TIMESTAMP DEFAULT NOW(),
  actual_miles DECIMAL(4,1),
  duration_minutes INT,
  rpe INT CHECK (rpe >= 1 AND rpe <= 10),
  notes TEXT,
  fueling_carbs_per_hour INT,
  fueling_hydration TEXT
);
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:seed      # Seed database with training plan
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to database
```

## Training Plan

8-week plan from January 5, 2026 to March 1, 2026 (Race Day):

| Week | Long Run | Total Miles | Focus |
|------|----------|-------------|-------|
| 1 | 14 mi | ~33 mi | Build |
| 2 | 15 mi | ~37 mi | Build |
| 3 | 16 mi | ~40 mi | Build |
| 4 | 18 mi | ~43 mi | Build |
| 5 | 20 mi (Peak) | ~45 mi | Peak |
| 6 | 14 mi | ~36 mi | Taper |
| 7 | 10 mi | ~28 mi | Taper |
| 8 | 26.2 mi | Race Week | Race |

## License

MIT
