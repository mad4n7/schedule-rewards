import { getTranslations } from 'next-intl/server'
import { BusinessForm } from '@/components/business/business-form'

export default async function CreateBusinessPage() {
  const t = await getTranslations('Business')

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">{t('create')}</h1>
      <BusinessForm />
    </div>
  )
}
