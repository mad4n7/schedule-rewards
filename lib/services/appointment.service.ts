import { AppointmentRepository } from '../repositories/appointment.repository';
import { appointments } from '@prisma/client';
import { AppointmentWithRelations } from '@/types';
import { CreateAppointmentInput, UpdateAppointmentInput } from '../validations/appointment.schema';
import { NotFoundError, ValidationError } from '../utils/errors';

export class AppointmentService {
  private repository: AppointmentRepository;

  constructor() {
    this.repository = new AppointmentRepository();
  }

  async getAppointmentById(id: string): Promise<AppointmentWithRelations> {
    const appointment = await this.repository.findById(id);
    if (!appointment) {
      throw new NotFoundError('Appointment');
    }
    return appointment;
  }

  async getBusinessAppointments(businessId: string): Promise<AppointmentWithRelations[]> {
    return await this.repository.findByBusinessId(businessId);
  }

  async createAppointment(data: CreateAppointmentInput & { customer_id: string }): Promise<AppointmentWithRelations> {
    // Calculate total duration and price
    const totalDuration = data.services.reduce((sum, service) => sum + service.duration, 0);
    const totalPrice = data.services.reduce((sum, service) => sum + service.price, 0);

    // Get the time slot to validate availability
    const timeSlot = await this.repository.prisma.business_time_slots.findUnique({
      where: { id: data.business_time_slot_id },
    });

    if (!timeSlot) {
      throw new NotFoundError('Time slot');
    }

    if (!timeSlot.is_available || timeSlot.booked_count >= timeSlot.capacity) {
      throw new ValidationError('Time slot is not available');
    }

    const appointment = await this.repository.create(
      {
        business_id: data.business_id,
        customer_id: data.customer_id,
        business_time_slot_id: data.business_time_slot_id,
        start_datetime: timeSlot.date,
        end_datetime: new Date(timeSlot.date.getTime() + totalDuration * 60000),
        duration: totalDuration,
        total_price: totalPrice,
        status: 'PENDING',
        customer_notes: data.customer_notes,
      },
      data.services
    );

    // Update time slot availability
    await this.repository.prisma.business_time_slots.update({
      where: { id: data.business_time_slot_id },
      data: {
        booked_count: { increment: 1 },
        is_available: timeSlot.booked_count + 1 < timeSlot.capacity,
      },
    });

    return appointment;
  }

  async updateAppointment(id: string, data: UpdateAppointmentInput): Promise<appointments> {
    const appointment = await this.repository.findById(id);
    if (!appointment) {
      throw new NotFoundError('Appointment');
    }

    if (appointment.status === 'CANCELLED') {
      throw new ValidationError('Cannot update cancelled appointment');
    }

    return await this.repository.update(id, data);
  }

  async cancelAppointment(id: string, reason: string): Promise<appointments> {
    const appointment = await this.repository.findById(id);
    if (!appointment) {
      throw new NotFoundError('Appointment');
    }

    if (appointment.status === 'CANCELLED') {
      throw new ValidationError('Appointment is already cancelled');
    }

    if (appointment.status === 'COMPLETED') {
      throw new ValidationError('Cannot cancel completed appointment');
    }

    const cancelledAppointment = await this.repository.cancel(id, reason);

    // Release the time slot
    await this.repository.prisma.business_time_slots.update({
      where: { id: appointment.business_time_slot_id },
      data: {
        booked_count: { decrement: 1 },
        is_available: true,
      },
    });

    return cancelledAppointment;
  }
}
