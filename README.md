# Micro-SaaS Marketplace

Professional toolkit marketplace for content creators. Comprehensive tools for content planning, SEO, analytics, social media, and revenue optimization.

## Features

- **Complete Toolkit**: Every tool competitors have, but better
- **Unique Features**: Tools and features competitors don't offer
- **Professional Design**: Monochrome design with blue accent - no childish elements
- **Essential Tools**: Content planning, SEO, analytics, social media, video, design, writing, revenue tracking
- **Advanced Features**: AI content generation, multi-platform scheduling, performance analytics, revenue optimization

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Design**: Professional monochrome with blue accent
- **Icons**: Lucide React

## Getting Started

### Database setup (Neon)

If you want the Neon-backed features (comments, analytics, scheduled posts, and **accounts/sessions/password reset**):

1. Create a Neon Postgres database and copy its connection string.
2. Set `DATABASE_URL` in `.env.local`.
3. Apply the schema:

```bash
npm run db:init
```

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Design System

- **Monochrome Palette**: Professional grayscale from mono-50 to mono-950
- **Blue Accent**: accent-400 to accent-700 for interactive elements
- **Typography**: Inter font family
- **No Emojis**: Professional only, no childish elements

## Project Structure

```
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Stats.tsx
│   ├── ValuePropositions.tsx
│   ├── ToolCategories.tsx
│   └── FeaturedTools.tsx
└── package.json
```

## License

Private project - All rights reserved.


