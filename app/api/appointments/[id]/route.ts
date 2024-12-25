import { NextRequest, NextResponse } from 'next/server';
import { AppointmentService } from '@/lib/services/appointment.service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { ApiResponse } from '@/types';
import { appointments } from '@prisma/client';
import { withErrorHandler } from '@/lib/middleware/withErrorHandler';
import { updateAppointmentSchema } from '@/lib/validations/appointment.schema';
import { UnauthorizedError, ForbiddenError } from '@/lib/utils/errors';

const appointmentService = new AppointmentService();

export const GET = withErrorHandler(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  const appointment = await appointmentService.getAppointmentById(params.id);

  // Check if user has access to this appointment
  const customer = await prisma.customers.findFirst({
    where: { user_id: session.user.id },
  });

  const business = await prisma.businesses.findFirst({
    where: { user_id: session.user.id },
  });

  if (
    appointment.customer_id !== customer?.id &&
    appointment.business_id !== business?.id
  ) {
    throw new ForbiddenError();
  }

  return NextResponse.json({
    success: true,
    data: appointment,
  });
});

export const PATCH = withErrorHandler(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  const body = await req.json();
  const validatedData = updateAppointmentSchema.parse(body);

  const appointment = await appointmentService.getAppointmentById(params.id);

  // Check if user has access to this appointment
  const customer = await prisma.customers.findFirst({
    where: { user_id: session.user.id },
  });

  const business = await prisma.businesses.findFirst({
    where: { user_id: session.user.id },
  });

  if (
    appointment.customer_id !== customer?.id &&
    appointment.business_id !== business?.id
  ) {
    throw new ForbiddenError();
  }

  const updatedAppointment = await appointmentService.updateAppointment(
    params.id,
    validatedData
  );

  return NextResponse.json({
    success: true,
    data: updatedAppointment,
  });
});

export const DELETE = withErrorHandler(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  const body = await req.json();
  const { reason } = body;

  if (!reason) {
    return NextResponse.json(
      { success: false, error: 'Cancellation reason is required' },
      { status: 400 }
    );
  }

  const appointment = await appointmentService.getAppointmentById(params.id);

  // Check if user has access to this appointment
  const customer = await prisma.customers.findFirst({
    where: { user_id: session.user.id },
  });

  const business = await prisma.businesses.findFirst({
    where: { user_id: session.user.id },
  });

  if (
    appointment.customer_id !== customer?.id &&
    appointment.business_id !== business?.id
  ) {
    throw new ForbiddenError();
  }

  const cancelledAppointment = await appointmentService.cancelAppointment(
    params.id,
    reason
  );

  return NextResponse.json({
    success: true,
    data: cancelledAppointment,
  });
});
