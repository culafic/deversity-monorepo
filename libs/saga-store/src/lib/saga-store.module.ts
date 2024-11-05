import { DynamicModule, Global, Module } from '@nestjs/common';
import { SagaService } from './saga-service';

@Global()
@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class SagaStoreModule {
  public static register(options: any): DynamicModule {
    return {
      exports: [SagaService],
      module: SagaStoreModule,
      providers: [
        { provide: 'SAGA_STORE_OPTIONS', useValue: options },
        SagaService
      ],

    }
  }
}
