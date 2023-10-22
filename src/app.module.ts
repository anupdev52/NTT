import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationModule } from './reservation/reservation.module';
import { APP_PIPE } from '@nestjs/core';
import config from './config/default';
import { ConfigFactory, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot(''),
    ReservationModule,
    ConfigModule.forRoot({
      load: [config as ConfigFactory],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
