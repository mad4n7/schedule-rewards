This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Database Setup

Before running the application, you need to set up the database:

1. Make sure you have PostgreSQL installed and running
2. Create a `.env` file in the root directory with your database connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/schedule_rewards"
```

3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Generate the Prisma client:

```bash
npx prisma generate
```

5. Create and seed the database:

```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

6. (Optional) View your database with Prisma Studio:

```bash
npx prisma studio
```

### Database Setup

1. Run database migrations:
```bash
npx prisma migrate deploy
```

2. Seed the database with initial plans:
```bash
npx prisma db seed
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
