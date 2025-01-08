import { getTranslations } from 'next-intl/server'
import { PaymentDetails } from '@/components/business/payment-details'

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: { businessId: string }
  searchParams: { code: string }
}) {
  const t = await getTranslations('Business')

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">{t('payment.title')}</h1>
      <PaymentDetails
        businessId={params.businessId}
        pixCode={searchParams.code}
      />
    </div>
  )
}
