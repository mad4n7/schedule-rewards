'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { businessOnboardingLocationSchema } from '@/lib/validations/business.schema';
import type { BusinessOnboardingLocation } from '@/lib/validations/business.schema';
import { useLocations } from '@/lib/hooks/use-locations';

interface LocationFormProps {
  initialData?: BusinessOnboardingLocation;
  onSubmit: (data: BusinessOnboardingLocation) => void;
}

export function LocationForm({ initialData, onSubmit }: LocationFormProps) {
  const t = useTranslations('business.onboarding.form.location');
  const { states, cities, selectedState, setSelectedState, countryCode, setCountryCode, isLoading } = useLocations(
    initialData?.country,
    initialData?.state
  );

  const form = useForm<BusinessOnboardingLocation>({
    resolver: zodResolver(businessOnboardingLocationSchema),
    defaultValues: {
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      postal_code: initialData?.postal_code || '',
      country: initialData?.country || countryCode,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('address')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('addressDescription')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => {
              const handleStateChange = (value: string) => {
                field.onChange(value);
                setSelectedState(value);
                form.setValue('city', '');
              };

              return (
                <FormItem>
                  <FormLabel>{t('state')}</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      defaultValue={field.value}
                      onValueChange={handleStateChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectState')} />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.id} value={state.id}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('city')}</FormLabel>
                <FormControl>
                  <Select
                    disabled={!selectedState || isLoading}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCity')} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('postalCode')}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t('postalCodeDescription')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('country')}</FormLabel>
                <FormControl>
                  <Select
                    disabled={isLoading}
                    defaultValue={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setCountryCode(value);
                      form.setValue('state', '');
                      form.setValue('city', '');
                      setSelectedState('');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCountry')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="BR">Brazil</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">{t('buttons.next')}</Button>
        </div>
      </form>
    </Form>
  );
}
