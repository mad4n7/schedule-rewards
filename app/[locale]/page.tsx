import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Locale } from '@/config/i18n-config';

interface Props {
  params: { locale: Locale }
}

export default async function HomePage({ params: { locale } }: Props) {
  const session = await getServerSession(authOptions);
  const t = await getTranslations();

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/signin`);
  }

  // Get user's businesses
  const businesses = await prisma.business.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      plan: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('dashboard')}</h1>
      
      {businesses.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">{t('noBusinesses')}</p>
          <a
            href={`/${locale}/business/create`}
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
          >
            {t('createBusiness')}
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">{business.name}</h2>
              <p className="text-gray-600 mb-4">{business.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {business.plan.name}
                </span>
                <a
                  href={`/${locale}/business/${business.id}`}
                  className="text-primary hover:underline"
                >
                  {t('manage')}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
