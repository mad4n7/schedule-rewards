"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Icons } from "@/components/icons";
import { Plan } from "@prisma/client";
import { currencySymbol } from "@/lib/contants/currencySymbol";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  planId: z.string().min(1),
});

export function BusinessForm() {
  const t = useTranslations("Business");
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      planId: "",
    },
  });

  // Fetch plans on component mount
  useState(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then(setPlans)
      .catch(console.error);
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        toast.error(t("errors.creation"));
        return;
      }

      const { business, payment } = await response.json();
      toast.success(t("success.created"));

      // Redirect to payment page
      router.push(`/business/${business.id}/payment?code=${payment.pixCode}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("errors.creation"),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
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
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t("choosePlan")}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className="p-6">
                <FormField
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={plan.id} id={plan.id} />
                            <div>
                              <h3 className="font-medium">{plan.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {plan.description}
                              </p>
                              <p className="text-lg font-bold">
                                {currencySymbol(locale)} {plan.price.toString()}
                              </p>
                              <ul className="mt-2 space-y-1">
                                {plan.features.map((feature, index) => (
                                  <li key={index} className="text-sm">
                                    • {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          {t("create")}
        </Button>
      </form>
    </Form>
  );
}
