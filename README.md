# InvestTrack - Investment Portfolio Tracker

A professional investment portfolio tracking application built with Next.js 15, featuring institutional-grade analytics and a sophisticated financial design aesthetic.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom financial theme
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth v5 (App Router compatible)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Features

### User Roles
- **Admin**: Manage investors, view all portfolios, and access system-wide analytics
- **Investor**: Track personal portfolios, view performance, and manage transactions

### Key Functionality
- Portfolio management with multiple holdings
- Transaction tracking (BUY, SELL, DIVIDEND, SPLIT, TRANSFER)
- Real-time performance analytics
- Asset price history tracking
- Professional financial dashboards
- Role-based access control

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/              # Authentication pages
│   ├── (dashboard)/
│   │   ├── admin/              # Admin dashboard
│   │   └── investor/           # Investor dashboard
│   ├── api/
│   │   └── auth/               # NextAuth API routes
│   ├── layout.tsx              # Root layout with dark theme
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── layout/                 # Layout components
├── lib/
│   ├── actions/                # Server actions
│   ├── auth.ts                 # NextAuth configuration
│   ├── auth.config.ts          # NextAuth config
│   ├── prisma.ts               # Prisma client
│   ├── utils.ts                # Utility functions
│   └── validations.ts          # Zod schemas
├── types/
│   ├── index.ts                # App types
│   └── next-auth.d.ts          # NextAuth type extensions
└── middleware.ts               # Route protection
prisma/
└── schema.prisma               # Database schema
```

## Database Schema

The application uses a comprehensive Prisma schema with the following models:

- **User**: Authentication and user management
- **Account/Session**: NextAuth session management
- **Portfolio**: User portfolios
- **Asset**: Stock/ETF/Crypto information
- **Holding**: Current positions in portfolios
- **Transaction**: Buy/sell history
- **AssetPrice**: Historical price tracking

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/investment_tracker?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

Generate a secret key:
```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# (Optional) Seed the database
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```
 

## Design Philosophy

### Color Palette
- **Background**: Deep navy blue (NOT pure black)
- **Cards**: Slightly lighter navy for depth
- **Primary**: Muted slate blue for interactive elements
- **Profit**: Muted green for gains
- **Loss**: Muted red for losses
- **Accents**: Slate grays for professional financial aesthetic

### Design Principles
- Professional Bloomberg/terminal-inspired interface
- High information density without clutter
- Clear visual hierarchy
- Muted colors for extended viewing comfort
- Accessible contrast ratios

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio database GUI
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client

## Routes

### Public
- `/` - Landing page

### Authentication
- `/login` - Login page

### Protected (Investor)
- `/investor` - Investor dashboard
- Portfolio views and management
- Transaction history

### Protected (Admin)
- `/admin` - Admin dashboard
- User management
- System-wide analytics

## Utility Functions

Located in `src/lib/utils.ts`:

- `formatCurrency(value)` - Format numbers as currency
- `formatPercentage(value)` - Format percentages with +/- signs
- `formatCompactNumber(value)` - Format large numbers (K, M, B)
- `calculatePercentageChange(current, previous)` - Calculate % change
- `getChangeColorClass(value)` - Get profit/loss text color class

## Form Validation

All forms use Zod schemas defined in `src/lib/validations.ts`:

- Login/Register validation
- Portfolio creation/update
- Transaction creation
- Asset creation

## Next Steps

1. **Connect PostgreSQL Database**: Update `DATABASE_URL` in `.env`
2. **Run Migrations**: `npx prisma migrate dev`
3. **Create First Admin User**: Build a seed script or admin creation page
4. **Add Real-time Data**: Integrate with financial APIs (Alpha Vantage, Yahoo Finance, etc.)
5. **Implement Charts**: Add Recharts visualizations to dashboard
6. **Add Export Features**: PDF/CSV report generation
7. **Build Transaction Forms**: Create forms for adding investments
8. **Add Notifications**: Email or push notifications for important events

## Development Notes

- The app uses Next.js 15 App Router (not Pages Router)
- All components use TypeScript for type safety
- Authentication uses NextAuth v5 beta (latest App Router version)
- Forms use React Hook Form with Zod for validation
- Database queries use Prisma Client
- UI components are from shadcn/ui (customizable)

## Contributing

This is a starter template. Customize it according to your needs:

1. Update the color scheme in `src/app/globals.css`
2. Modify the Prisma schema for your data model
3. Add new pages/components as needed
4. Implement additional features (reports, alerts, etc.)

## License

MIT
