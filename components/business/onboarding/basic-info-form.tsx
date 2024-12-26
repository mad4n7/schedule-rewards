'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useCategories } from '@/lib/hooks/use-categories';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { businessOnboardingBasicInfoSchema } from '@/lib/validations/business.schema';
import type { BusinessOnboardingBasicInfo } from '@/lib/validations/business.schema';
import { FormWrapper } from './form-wrapper';

interface BasicInfoFormProps {
  initialData?: BusinessOnboardingBasicInfo;
  onSubmit: (data: BusinessOnboardingBasicInfo) => void;
}

export function BasicInfoForm({ initialData, onSubmit }: BasicInfoFormProps) {
  const t = useTranslations('business.onboarding');
  const { categories, isLoading } = useCategories();

  const form = useForm<BusinessOnboardingBasicInfo>({
    resolver: zodResolver(businessOnboardingBasicInfoSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      category_id: '',
    },
  });

  return (
    <FormWrapper>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.basicInfo.name')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.basicInfo.description')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.basicInfo.category')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.basicInfo.categoryDescription')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {t('buttons.next')}
          </Button>
        </form>
      </Form>
    </FormWrapper>
  );
}
