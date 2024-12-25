'use client'

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DashboardNav } from './dashboard-nav'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export function MobileNav() {
  const t = useTranslations('navigation')

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden text-gray-900 dark:text-gray-50"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">{t('openMenu')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 flex-col pr-0 bg-white dark:bg-gray-900">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center text-gray-900 dark:text-gray-50">
            <Image
              src="/logo.svg"
              alt="Schedule & Rewards"
              width={32}
              height={32}
              priority
              className="h-8 w-auto"
            />
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1">
          <DashboardNav />
        </div>
      </SheetContent>
    </Sheet>
  )
}
