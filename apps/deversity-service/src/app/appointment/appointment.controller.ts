import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppointmentService } from './appointment.service';
import { AppointmentDto, AppointmentsForDayDto } from '../dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}
  @Get('/:id')
  async getAppointments(@Param('id') id: string, @Req() req: Request) {
    try {
      const appointments = await this.appointmentService.getAppointments(id);
      return { success: true, data: appointments };
    } catch (error) {
      return { success: false, message: 'Failed to fetch appointments.' };
    }
  }

  @Post('/new')
  async newAppointment(
    @Body() appointmentParams: AppointmentDto,
    @Res() res: Response
  ) {
    try {
      const result = await this.appointmentService.addNewAppointment(
        appointmentParams
      );
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json({ success: false, message: error.message });
      }
      return res
        .status(500)
        .json({ success: false, message: 'Something went wrong!' });
    }
  }
  @Post('/appointmentsByDay')
  async getAppointmentsByDay(
    @Body() appointmentsByDayParams: AppointmentsForDayDto,
    @Res() res: Response
  ) {
    try {
      const result = await this.appointmentService.getAppointmentsForDay(
        appointmentsByDayParams
      );
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: 'Something went wrong!' });
    }
  }
}
