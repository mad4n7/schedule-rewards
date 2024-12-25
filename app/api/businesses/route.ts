import { NextRequest, NextResponse } from 'next/server';
import { BusinessService } from '@/lib/services/business.service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { ApiResponse } from '@/types';
import { businesses } from '@prisma/client';

const businessService = new BusinessService();

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<businesses[]>>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const businesses = await businessService.getBusinessesByUserId(session.user.id);
    
    return NextResponse.json({
      success: true,
      data: businesses,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<businesses>>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const business = await businessService.createBusiness({
      ...body,
      user_id: session.user.id,
    });
    
    return NextResponse.json({
      success: true,
      data: business,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
