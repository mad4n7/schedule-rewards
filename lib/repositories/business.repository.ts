import { BusinessWithRelations } from '@/types';
import { BaseRepository } from './base.repository';
import { businesses } from '@prisma/client';

export class BusinessRepository extends BaseRepository {
  async findById(id: string): Promise<BusinessWithRelations | null> {
    try {
      return await this.prisma.businesses.findUnique({
        where: { id },
        include: {
          business_schedules: true,
          services: true,
          business_rewards: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findByUserId(userId: string): Promise<businesses[]> {
    try {
      return await this.prisma.businesses.findMany({
        where: { user_id: userId },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: Omit<businesses, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<businesses> {
    try {
      return await this.prisma.businesses.create({
        data,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, data: Partial<businesses>): Promise<businesses> {
    try {
      return await this.prisma.businesses.update({
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

  async delete(id: string): Promise<businesses> {
    try {
      return await this.prisma.businesses.update({
        where: { id },
        data: {
          deleted_at: new Date(),
          status: 'INACTIVE',
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
