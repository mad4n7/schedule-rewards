'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

interface PaymentDetailsProps {
  businessId: string
  pixCode: string
}

export function PaymentDetails({ businessId, pixCode }: PaymentDetailsProps) {
  const t = useTranslations('Business.payment')
  const [copied, setCopied] = useState(false)

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      toast.success(t('pixCodeCopied'))
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Poll for payment status
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/business/${businessId}`)
        const business = await response.json()
        
        if (business.active) {
          toast.success(t('success.paymentReceived'))
          // Redirect to business dashboard or home
          window.location.href = '/'
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
      }
    }

    const interval = setInterval(checkPaymentStatus, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [businessId])

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">{t('instructions.title')}</h3>
          <ul className="mt-2 space-y-2">
            <li>{t('instructions.step1')}</li>
            <li>{t('instructions.step2')}</li>
            <li>{t('instructions.step3')}</li>
            <li>{t('instructions.step4')}</li>
            <li>{t('instructions.step5')}</li>
          </ul>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('pixCode')}
          </label>
          <div className="flex gap-2">
            <code className="flex-1 p-2 bg-muted rounded-md overflow-x-auto">
              {pixCode}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={copyPixCode}
              className="shrink-0"
            >
              {copied ? (
                <Icons.check className="h-4 w-4" />
              ) : (
                <Icons.copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {t('instructions.note')}
        </div>
      </div>
    </Card>
  )
}
