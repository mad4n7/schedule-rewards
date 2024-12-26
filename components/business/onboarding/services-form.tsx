'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { businessOnboardingServicesSchema } from '@/lib/validations/business.schema';
import type { BusinessOnboardingServices } from '@/lib/validations/business.schema';

interface ServicesFormProps {
  initialData?: BusinessOnboardingServices;
  onSubmit: (data: BusinessOnboardingServices) => void;
}

export function ServicesForm({ initialData, onSubmit }: ServicesFormProps) {
  const t = useTranslations('business.onboarding.form.services');

  const form = useForm<{ services: BusinessOnboardingServices }>({
    resolver: zodResolver(businessOnboardingServicesSchema),
    defaultValues: {
      services: initialData || [{
        name: '',
        description: '',
        price: 0,
        duration: 30,
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'services',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(data => onSubmit(data.services))} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{t('name')}</h3>
              {index > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  &times;
                </Button>
              )}
            </div>

            <FormField
              control={form.control}
              name={`services.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`services.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`services.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('price')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`services.${index}.duration`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('duration')}</FormLabel>
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
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => append({
            name: '',
            description: '',
            price: 0,
            duration: 30,
          })}
        >
          {t('addService')}
        </Button>

        <Button type="submit" className="w-full">
          {t('buttons.finish')}
        </Button>
      </form>
    </Form>
  );
}
