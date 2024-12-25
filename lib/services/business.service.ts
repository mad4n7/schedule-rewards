import { BusinessRepository } from '../repositories/business.repository';
import { businesses } from '@prisma/client';
import { BusinessWithRelations } from '@/types';

export class BusinessService {
  private repository: BusinessRepository;

  constructor() {
    this.repository = new BusinessRepository();
  }

  async getBusinessById(id: string): Promise<BusinessWithRelations | null> {
    return await this.repository.findById(id);
  }

  async getBusinessesByUserId(userId: string): Promise<businesses[]> {
    return await this.repository.findByUserId(userId);
  }

  async createBusiness(data: {
    name: string;
    description: string;
    user_id: string;
    category_id: string;
    location_id: string;
  }): Promise<businesses> {
    return await this.repository.create({
      ...data,
      status: 'ACTIVE',
    });
  }

  async updateBusiness(id: string, data: Partial<businesses>): Promise<businesses> {
    return await this.repository.update(id, data);
  }

  async deleteBusiness(id: string): Promise<businesses> {
    return await this.repository.delete(id);
  }
}
