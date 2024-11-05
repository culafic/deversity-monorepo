import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SagaStoreModule } from '@deversity-monorepo/saga-store';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    SagaStoreModule.register({
      name: 'SagaDB',
    }),
    AppointmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
