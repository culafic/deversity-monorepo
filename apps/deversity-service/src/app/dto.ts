export interface AppointmentDto {
  sagaId: string;
  patientName: string;
  description: string;
  date: Date;
  duration: number;
}
export interface AppointmentsForDayDto {
  day: string;
  sagaId: string;
}
