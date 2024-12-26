'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { businessOnboardingScheduleSchema } from '@/lib/validations/business.schema';
import type { BusinessOnboardingSchedule } from '@/lib/validations/business.schema';

interface ScheduleFormProps {
  initialData?: BusinessOnboardingSchedule;
  onSubmit: (data: BusinessOnboardingSchedule) => void;
}

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const DEFAULT_SCHEDULE = DAYS_OF_WEEK.map((_, index) => ({
  dayOfWeek: index,
  startTime: '09:00',
  endTime: '17:00',
  isClosed: false,
  slotDuration: 30,
  slotsPerInterval: 1,
}));

export function ScheduleForm({ initialData, onSubmit }: ScheduleFormProps) {
  const t = useTranslations('business.onboarding.form.schedule');

  const form = useForm<BusinessOnboardingSchedule>({
    resolver: zodResolver(businessOnboardingScheduleSchema),
    defaultValues: initialData || DEFAULT_SCHEDULE,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {DAYS_OF_WEEK.map((day, index) => (
          <div key={day} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{t(`days.${day.toLowerCase()}`)}</h3>
              <FormField
                control={form.control}
                name={`${index}.isClosed`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormLabel>{t('isClosed')}</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {!form.watch(`${index}.isClosed`) && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`${index}.startTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('startTime')}</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${index}.endTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('endTime')}</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${index}.slotDuration`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('slotDuration')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`${index}.slotsPerInterval`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('slotsPerInterval')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        ))}

        <Button type="submit" className="w-full">
          {t('buttons.next')}
        </Button>
      </form>
    </Form>
  );
}
