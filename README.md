# Race Training Tracker

A dynamic marathon / half marathon training tracker. Enter your race details and get a personalized 8-week training plan. Built with Next.js 16, Vercel Postgres, and Drizzle ORM.

## Features

- **Dynamic Setup**: Enter race name, location, date, and distance (full or half marathon) to generate your plan
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

## Getting Started

```bash
npm install
npm run dev
```

Open the app and you'll be guided through setup -- enter your race details and the training plan is generated automatically.

## Deployment

```bash
vercel link
vercel --prod
```

After deploying, the app will prompt for race setup on first visit.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:seed      # Create database tables
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to database
```
