"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCategories } from "@/lib/hooks/use-categories";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { businessOnboardingBasicInfoSchema } from "@/lib/validations/business.schema";
import type { BusinessOnboardingBasicInfo } from "@/lib/validations/business.schema";
import { FormWrapper } from "./form-wrapper";

interface BasicInfoFormProps {
  initialData?: BusinessOnboardingBasicInfo;
  onSubmit: (data: BusinessOnboardingBasicInfo) => void;
}

export type BasicInfoFormRef = {
  submit: () => Promise<boolean>;
};

export const BasicInfoForm = forwardRef<BasicInfoFormRef, BasicInfoFormProps>(
  function BasicInfoForm({ initialData, onSubmit }, ref) {
    const t = useTranslations("business.onboarding");
    const { categories, isLoading } = useCategories();

    const form = useForm<BusinessOnboardingBasicInfo>({
      resolver: zodResolver(businessOnboardingBasicInfoSchema),
      defaultValues: initialData || {
        name: "",
        description: "",
        category_id: "",
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.basicInfo.name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("form.basicInfo.nameDescription")}
                      aria-describedby="name-description"
                    />
                  </FormControl>
                  <FormMessage id="name-description" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.basicInfo.description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("form.basicInfo.descriptionDescription")}
                      aria-describedby="description-description"
                    />
                  </FormControl>
                  <FormMessage id="description-description" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.basicInfo.category")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.basicInfo.categoryDescription")}
                        />
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
                  <FormMessage id="category-description" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </FormWrapper>
    );
  },
);
