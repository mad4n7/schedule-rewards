import { NextRequest, NextResponse } from 'next/server';
import { AppointmentService } from '@/lib/services/appointment.service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { ApiResponse } from '@/types';
import { appointments } from '@prisma/client';
import { withErrorHandler } from '@/lib/middleware/withErrorHandler';
import { createAppointmentSchema } from '@/lib/validations/appointment.schema';
import { UnauthorizedError } from '@/lib/utils/errors';

const appointmentService = new AppointmentService();

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('businessId');

  if (!businessId) {
    return NextResponse.json(
      { success: false, error: 'Business ID is required' },
      { status: 400 }
    );
  }

  const appointments = await appointmentService.getBusinessAppointments(businessId);

  return NextResponse.json({
    success: true,
    data: appointments,
  });
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  const body = await req.json();
  const validatedData = createAppointmentSchema.parse(body);

  // Get customer ID from user ID
  const customer = await prisma.customers.findFirst({
    where: { user_id: session.user.id },
  });

  if (!customer) {
    return NextResponse.json(
      { success: false, error: 'Customer profile not found' },
      { status: 404 }
    );
  }

  const appointment = await appointmentService.createAppointment({
    ...validatedData,
    customer_id: customer.id,
  });

  return NextResponse.json({
    success: true,
    data: appointment,
  });
});
