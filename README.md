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

4. Generate the Prisma client and push the schema:

```bash
npx prisma generate
npx prisma db push
```

5. Seed the database with initial data:

For English (default):
```bash
npx ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts
```

For Portuguese (Brazil):
```bash
npx ts-node --compiler-options {"module":"CommonJS"} prisma/seed.pt.ts
```

Note: Running the seed command will reset the database and populate it with the selected language's data. Make sure to back up any existing data before running the seed command.

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

## Translations

This project uses `next-intl` for internationalization. All translations are stored in JSON files under the `messages` directory.

### Structure

```
messages/
  ├── en.json    # English translations
  └── pt.json    # Portuguese translations
```

### Using Translations

#### In Client Components

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('namespace');
  
  return <div>{t('key')}</div>;
}
```

#### In Server Components

```tsx
import { getTranslations } from 'next-intl/server';

export default async function MyServerComponent() {
  const t = await getTranslations('namespace');
  
  return <div>{t('key')}</div>;
}
```

#### In API Routes

```typescript
import { getTranslations } from 'next-intl/server';

export async function POST(req: Request) {
  const { locale = 'en' } = await req.json();
  const t = await getTranslations({ locale, namespace: 'namespace' });
  
  return Response.json({ message: t('key') });
}
```

### Translation Files Structure

The translation files follow a nested structure for better organization:

```json
{
  "auth": {
    "signIn": "Sign In",
    "signUp": "Sign Up"
  },
  "errors": {
    "validation": {
      "required": "This field is required"
    },
    "server": {
      "internalError": "An internal error occurred"
    }
  }
}
```

### Adding New Translations

1. Add your new translation key to `messages/en.json`
2. Add the same key with the translated text to `messages/pt.json`
3. Use the key in your component: `t('namespace.key')`

### Best Practices

1. **Namespacing**: Group related translations under meaningful namespaces (e.g., 'auth', 'profile', 'errors')
2. **Consistency**: Use the same keys across all language files
3. **Parameters**: For dynamic content, use parameters:
   ```tsx
   // In translation file
   {
     "welcome": "Welcome, {name}!"
   }
   
   // In component
   t('welcome', { name: user.name })
   ```
4. **Maintenance**: Keep translation files organized and documented
5. **Fallbacks**: Always provide English translations as fallback

### Available Languages

- English (en) - Default
- Portuguese (pt)

To add a new language:
1. Create a new file in `messages/` (e.g., `es.json` for Spanish)
2. Copy the structure from `en.json`
3. Translate all the strings
4. Add the language code to the supported locales in `config/languages.ts`

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
