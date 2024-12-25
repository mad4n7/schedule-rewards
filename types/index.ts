import { Prisma } from '@prisma/client';

export type BusinessWithRelations = Prisma.businessesGetPayload<{
  include: {
    business_schedules: true;
    services: true;
    business_rewards: true;
  };
}>;

export type AppointmentWithRelations = Prisma.appointmentsGetPayload<{
  include: {
    appointment_services: {
      include: {
        business_services: true;
      };
    };
    businesses: true;
    customers: true;
  };
}>;

export type CustomerWithRewards = Prisma.customersGetPayload<{
  include: {
    customer_reward_progress: true;
    customer_reward_redemptions: true;
  };
}>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
