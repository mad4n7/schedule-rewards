import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  protected async handleError(error: any): Promise<never> {
    console.error('Database error:', error);
    
    if (error.code === 'P2002') {
      throw new Error('Unique constraint violation');
    }
    
    if (error.code === 'P2025') {
      throw new Error('Record not found');
    }
    
    throw new Error('An unexpected error occurred');
  }
}
