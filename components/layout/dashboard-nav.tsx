'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import {
  CalendarIcon,
  GiftIcon,
  HomeIcon,
  BuildingStorefrontIcon,
  UserIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'appointments', href: '/dashboard/appointments', icon: CalendarIcon },
  { name: 'rewards', href: '/dashboard/rewards', icon: GiftIcon },
  { name: 'business', href: '/dashboard/business', icon: BuildingStorefrontIcon },
  { name: 'profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'settings', href: '/dashboard/settings', icon: Cog8ToothIcon },
]

export function DashboardNav() {
  const pathname = usePathname()
  const t = useTranslations('navigation')

  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6',
                      isActive
                        ? 'bg-gray-50 text-primary font-semibold dark:bg-gray-800'
                        : 'text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-6 w-6 shrink-0',
                        isActive
                          ? 'text-primary'
                          : 'text-gray-400 group-hover:text-primary dark:text-gray-500'
                      )}
                      aria-hidden="true"
                    />
                    {t(item.name)}
                  </Link>
                </li>
              )
            })}
          </ul>
        </li>
      </ul>
    </nav>
  )
}
