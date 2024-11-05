import { SagaService } from '@deversity-monorepo/saga-store';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AppointmentService {
  constructor(private readonly sagaService: SagaService) {}

  private isValidStartTime(startTime: Date): boolean {
    const minutes = startTime.getMinutes();
    return minutes === 0 || minutes === 30;
  }

  async getAllAppointments(id) {
    try {
      const saga = await this.sagaService.get<any>(id);
      return saga;
    } catch (error) {
      return;
    }
  }

  async addNewAppointment(appointment) {
    let saga;
    if (!this.isValidStartTime(appointment.date)) {
      throw new BadRequestException(
        'Appointments can only start on full or half-hours.'
      );
    }
    if (appointment.duration < 30 || appointment.duration % 30 !== 0) {
      throw new BadRequestException(
        'The appointment duration must be at least 30 minutes and a multiple of 30 minutes.'
      );
    }
    if (appointment.date.getDate() !== new Date().getDate()) {
      throw new BadRequestException('Appointments cannot span multiple days.');
    }

    const { sagaId, ...rest } = appointment;

    if (sagaId) {
      saga = await this.sagaService.get<any>(sagaId);
      const newAppointments = [...saga.appointments, rest];
      await this.sagaService.upadateSaga(saga, newAppointments);
    }
    {
      saga = await this.sagaService.makeSaga({ appointments: rest });
    }

    return { result: 'OK', sagaId: saga.id };
  }

  async getAppointmentsForDay(appointmentsByDayParams) {
    const target = new Date(appointmentsByDayParams.day);
    const saga = await this.sagaService.get<any>(
      appointmentsByDayParams.sagaId
    );
    const appoinments = saga.appointments;

    return appoinments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getFullYear() === target.getFullYear() &&
        appointmentDate.getMonth() === target.getMonth() &&
        appointmentDate.getDate() === target.getDate()
      );
    });
  }
}
