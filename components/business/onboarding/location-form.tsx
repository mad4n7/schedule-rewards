"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { businessOnboardingLocationSchema } from "@/lib/validations/business.schema";
import type { BusinessOnboardingLocation } from "@/lib/validations/business.schema";
import { FormWrapper } from "./form-wrapper";
import { useLocations } from "@/lib/hooks/use-locations";

interface LocationFormProps {
  initialData?: BusinessOnboardingLocation;
  onSubmit: (data: BusinessOnboardingLocation) => void;
}

export type LocationFormRef = {
  submit: () => Promise<boolean>;
};

export const LocationForm = forwardRef<LocationFormRef, LocationFormProps>(
  function LocationForm({ initialData, onSubmit }, ref) {
    const t = useTranslations("business.onboarding.form.location");
    const locale = useLocale();
    const defaultCountry = locale === 'pt-BR' ? 'BR' : 'US';
    
    const {
      states,
      cities,
      selectedState,
      setSelectedState,
      isLoading,
    } = useLocations(defaultCountry, initialData?.state);

    const form = useForm<BusinessOnboardingLocation>({
      resolver: zodResolver(businessOnboardingLocationSchema),
      defaultValues: {
        address: initialData?.address ?? "",
        city: initialData?.city ?? "",
        state: initialData?.state ?? "",
        postal_code: initialData?.postal_code ?? "",
        country: defaultCountry,
      },
    });

    useImperativeHandle(ref, () => ({
      submit: async () => {
        const result = await form.trigger();
        if (result) {
          const data = form.getValues();
          onSubmit(data);
        }
        return result;
      },
    }));

    return (
      <FormWrapper>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("address")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("addressDescription")}
                      aria-describedby="address-description"
                    />
                  </FormControl>
                  <FormMessage id="address-description" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("state")}</FormLabel>
                    <Select
                      disabled={isLoading}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedState(value);
                        form.setValue("city", "");
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder={t("stateDescription")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.id} value={state.id}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage id="state-description" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("city")}</FormLabel>
                    <Select
                      disabled={!selectedState || isLoading}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder={t("cityDescription")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage id="city-description" />
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
                    <FormLabel>{t("postalCode")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("postalCodeDescription")}
                        aria-describedby="postal_code-description"
                      />
                    </FormControl>
                    <FormMessage id="postal_code-description" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("country")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                        value={defaultCountry === 'US' ? 'United States' : 'Brasil'}
                        aria-describedby="country-description"
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormMessage id="country-description" />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </FormWrapper>
    );
  },
);
