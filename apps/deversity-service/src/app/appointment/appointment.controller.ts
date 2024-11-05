import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppointmentService } from './appointment.service';
import { AppointmentDto, AppointmentsForDayDto } from '../dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}
  @Get('/:id')
  async getAllAppointments(@Param('id') id: string, @Req() req: Request) {
    return this.appointmentService.getAllAppointments(id);
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
      return res.status(500).json({ success: false, message: error });
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
