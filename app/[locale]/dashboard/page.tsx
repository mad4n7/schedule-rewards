'use client'

import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const { data: session } = useSession()
  const t = useTranslations('dashboard')

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">
          {t('welcome', { name: session?.user?.name })}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Stats cards */}
          <div className="p-6 bg-primary/10 rounded-lg">
            <h3 className="text-lg font-medium">{t('stats.appointments')}</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="p-6 bg-primary/10 rounded-lg">
            <h3 className="text-lg font-medium">{t('stats.rewards')}</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="p-6 bg-primary/10 rounded-lg">
            <h3 className="text-lg font-medium">{t('stats.businesses')}</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="p-6 bg-primary/10 rounded-lg">
            <h3 className="text-lg font-medium">{t('stats.points')}</h3>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
