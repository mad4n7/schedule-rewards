'use client'

import { DashboardNav } from '@/components/layout/dashboard-nav'
import { UserNav } from '@/components/layout/user-nav'
import { MobileNav } from '@/components/layout/mobile-nav'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const t = useTranslations()
  
  // Get the current page title from the pathname
  const getTitle = () => {
    const path = pathname.split('/').pop()
    return path === 'dashboard' ? 'dashboard' : path || 'dashboard'
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-16 shrink-0 items-center">
            <Image
              src="/logo.svg"
              alt={t('scheduleAndRewards')}
              width={32}
              height={32}
              priority
              className="h-8 w-auto"
            />
          </div>
          <DashboardNav />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-72">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 w-full">
          <div className="flex w-full items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-x-4">
              <MobileNav />
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                {t(`navigation.${getTitle()}`)}
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <UserNav />
            </div>
          </div>
        </div>

        {/* Content area */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
