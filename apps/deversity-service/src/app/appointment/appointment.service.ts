import { SagaService } from '@deversity-monorepo/saga-store';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AppointmentService {
  constructor(private readonly sagaService: SagaService) {}

  private isValidStartTime(startTime: Date): boolean {
    const minutes = startTime.getMinutes();
    return minutes === 0 || minutes === 30;
  }

  async getAppointments(sagaId: string) {
    const saga = await this.sagaService.get<any>(sagaId);
    return saga.appointments;
  }

  async isOverlapping(
    newStartTime: Date,
    newDuration: number,
    sagaId: string
  ): Promise<boolean> {
    const newEndTime = new Date(newStartTime.getTime() + newDuration * 60000);
    const appointments = await this.getAppointments(sagaId);

    for (let appointment of appointments) {
      const appointmentEndTime = new Date(
        appointment.startTime.getTime() + appointment.duration * 60000
      );

      if (
        newStartTime < appointmentEndTime &&
        newEndTime > appointment.startTime
      ) {
        return true;
      }
    }
    return false;
  }

  async addNewAppointment(appointment) {
    let saga;

    const { sagaId, ...rest } = appointment;

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

    if (
      await this.isOverlapping(appointment.date, appointment.duration, sagaId)
    ) {
      throw new BadRequestException(
        'This appointment overlaps with an existing one.'
      );
    }

    if (sagaId) {
      saga = await this.sagaService.get<any>(sagaId);
      const updatedAppointments = [...saga.appointments, rest];
      const newAppointments = { appointments: updatedAppointments };
      await this.sagaService.upadateSaga(saga, newAppointments);
    }
    {
      saga = await this.sagaService.makeSaga({ appointments: [rest] });
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
