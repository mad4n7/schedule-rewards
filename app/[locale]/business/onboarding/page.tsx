'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BasicInfoForm } from '@/components/business/onboarding/basic-info-form';
import { LocationForm } from '@/components/business/onboarding/location-form';
import { ScheduleForm } from '@/components/business/onboarding/schedule-form';
import { ServicesForm } from '@/components/business/onboarding/services-form';
import { Steps } from '@/components/ui/steps';
import { toast } from 'sonner';
import type { BusinessOnboardingBasicInfo, BusinessOnboardingLocation, BusinessOnboardingSchedule, BusinessOnboardingServices } from '@/lib/validations/business.schema';

type OnboardingStep = 'basicInfo' | 'location' | 'schedule' | 'services';

interface OnboardingData {
  basicInfo?: BusinessOnboardingBasicInfo;
  location?: BusinessOnboardingLocation;
  schedule?: BusinessOnboardingSchedule;
  services?: BusinessOnboardingServices;
}

export default function BusinessOnboarding() {
  const t = useTranslations('business.onboarding');
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('basicInfo');
  const [data, setData] = useState<OnboardingData>({});

  const steps = [
    { id: 'basicInfo', label: t('steps.basicInfo') },
    { id: 'location', label: t('steps.location') },
    { id: 'schedule', label: t('steps.schedule') },
    { id: 'services', label: t('steps.services') },
  ];

  const handleNext = () => {
    const stepIndex = steps.findIndex(step => step.id === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id as OnboardingStep);
    }
  };

  const handlePrevious = () => {
    const stepIndex = steps.findIndex(step => step.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id as OnboardingStep);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data.basicInfo,
          location: data.location,
          schedule: data.schedule,
          services: data.services,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t('error.failed'));
      }

      const result = await response.json();
      toast.success(t('success.created'));
      router.push(`/business/${result.id}/dashboard`);
    } catch (error) {
      console.error('Error creating business:', error);
      toast.error(error instanceof Error ? error.message : t('error.failed'));
    }
  };

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'basicInfo':
        return (
          <BasicInfoForm
            initialData={data.basicInfo}
            onSubmit={(data) => {
              updateData({ basicInfo: data });
              handleNext();
            }}
          />
        );
      case 'location':
        return (
          <LocationForm
            initialData={data.location}
            onSubmit={(data) => {
              updateData({ location: data });
              handleNext();
            }}
          />
        );
      case 'schedule':
        return (
          <ScheduleForm
            initialData={data.schedule}
            onSubmit={(data) => {
              updateData({ schedule: data });
              handleNext();
            }}
          />
        );
      case 'services':
        return (
          <ServicesForm
            initialData={data.services}
            onSubmit={(data) => {
              updateData({ services: data });
              handleSubmit();
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <Steps
              steps={steps}
              currentStep={steps.findIndex(step => step.id === currentStep)}
            />
          </div>
          {renderStep()}
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep !== 'basicInfo' && (
            <Button
              variant="outline"
              onClick={handlePrevious}
            >
              {t('buttons.back')}
            </Button>
          )}
          {currentStep === 'basicInfo' && <div />}
          {currentStep === 'services' ? (
            <Button onClick={handleSubmit}>
              {t('buttons.finish')}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {t('buttons.next')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
