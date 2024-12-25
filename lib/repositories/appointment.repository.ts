import { AppointmentWithRelations } from '@/types';
import { BaseRepository } from './base.repository';
import { appointments, Prisma } from '@prisma/client';
import { NotFoundError } from '../utils/errors';

export class AppointmentRepository extends BaseRepository {
  async findById(id: string): Promise<AppointmentWithRelations | null> {
    try {
      return await this.prisma.appointments.findUnique({
        where: { id },
        include: {
          appointment_services: {
            include: {
              business_services: true,
            },
          },
          businesses: true,
          customers: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findByBusinessId(businessId: string): Promise<AppointmentWithRelations[]> {
    try {
      return await this.prisma.appointments.findMany({
        where: { business_id: businessId },
        include: {
          appointment_services: {
            include: {
              business_services: true,
            },
          },
          businesses: true,
          customers: true,
        },
        orderBy: {
          start_datetime: 'asc',
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(
    data: Omit<appointments, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
    services: Array<{
      business_service_id: string;
      price: number;
      duration: number;
      order: number;
    }>
  ): Promise<AppointmentWithRelations> {
    try {
      return await this.prisma.appointments.create({
        data: {
          ...data,
          appointment_services: {
            createMany: {
              data: services,
            },
          },
        },
        include: {
          appointment_services: {
            include: {
              business_services: true,
            },
          },
          businesses: true,
          customers: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, data: Partial<appointments>): Promise<appointments> {
    try {
      return await this.prisma.appointments.update({
        where: { id },
        data: {
          ...data,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancel(id: string, reason: string): Promise<appointments> {
    try {
      return await this.prisma.appointments.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelled_at: new Date(),
          cancellation_reason: reason,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
