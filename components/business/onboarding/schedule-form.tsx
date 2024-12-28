"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { businessOnboardingScheduleSchema } from "@/lib/validations/business.schema";
import type { BusinessOnboardingSchedule } from "@/lib/validations/business.schema";
import { cn } from "@/lib/utils";
import { FormWrapper } from "./form-wrapper";

interface ScheduleFormProps {
  initialData?: BusinessOnboardingSchedule;
  onSubmit: (data: BusinessOnboardingSchedule) => void;
}

export type ScheduleFormRef = {
  submit: () => Promise<boolean>;
};

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DEFAULT_SCHEDULE = DAYS_OF_WEEK.map((_, index) => ({
  dayOfWeek: index,
  startTime: "09:00",
  endTime: "17:00",
  isClosed: false,
  slotDuration: 30,
  slotsPerInterval: 1,
}));

export const ScheduleForm = forwardRef<ScheduleFormRef, ScheduleFormProps>(
  function ScheduleForm({ initialData, onSubmit }, ref) {
    const t = useTranslations("business.onboarding.form.schedule");

    const form = useForm<BusinessOnboardingSchedule>({
      resolver: zodResolver(businessOnboardingScheduleSchema),
      defaultValues: initialData || DEFAULT_SCHEDULE,
    });

    useImperativeHandle(ref, () => ({
      submit: async () => {
        const result = await form.trigger();
        if (result) {
          const data = form.getValues().map((schedule) => ({
            ...schedule,
            slotDuration: Number(schedule.slotDuration),
            slotsPerInterval: Number(schedule.slotsPerInterval),
          }));
          onSubmit(data);
        }
        return result;
      },
    }));

    return (
      <FormWrapper>
        <Form {...form}>
          <form className="space-y-6">
            {DAYS_OF_WEEK.map((day, index) => (
              <div key={day} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    {t(`days.${day.toLowerCase()}`)}
                  </h3>
                  <FormField
                    control={form.control}
                    name={`${index}.isClosed`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormLabel className="!mb-0">{t("isClosed")}</FormLabel>
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
                          <FormLabel>{t("startTime")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="time"
                                value={field.value || ""}
                                onChange={field.onChange}
                                className="[&::-webkit-calendar-picker-indicator]:bg-foreground/10 [&::-webkit-calendar-picker-indicator]:hover:bg-foreground/20"
                              />
                            </div>
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
                          <FormLabel>{t("endTime")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="time"
                                value={field.value || ""}
                                onChange={field.onChange}
                                className="[&::-webkit-calendar-picker-indicator]:bg-foreground/10 [&::-webkit-calendar-picker-indicator]:hover:bg-foreground/20"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`${index}.slotDuration`}
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>{t("slotDuration")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              value={value || ""}
                              onChange={(e) =>
                                onChange(
                                  e.target.value ? parseInt(e.target.value) : "",
                                )
                              }
                              {...field}
                              placeholder={t("slotDuration")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`${index}.slotsPerInterval`}
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>{t("slotsPerInterval")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              value={value || ""}
                              onChange={(e) =>
                                onChange(
                                  e.target.value ? parseInt(e.target.value) : "",
                                )
                              }
                              {...field}
                              placeholder={t("slotsPerInterval")}
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
          </form>
        </Form>
      </FormWrapper>
    );
  },
);
