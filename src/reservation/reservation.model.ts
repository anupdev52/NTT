// reservation.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDate,
  IsEnum,
  IsPositive,
} from 'class-validator';

enum ReservationStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

@Schema()
export class Reservation extends Document {
  @Prop({ required: true })
  @IsNumber()
  @IsPositive()
  guestMemberId: number;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  hotelName: string;

  @Prop({ required: true })
  @IsDate()
  arrivalDate: Date;

  @Prop({ required: true })
  @IsDate()
  departureDate: Date;

  @Prop({ enum: ReservationStatus, default: ReservationStatus.ACTIVE })
  @IsEnum(ReservationStatus)
  status: string;

  @Prop({ required: true })
  @IsNumber()
  @IsPositive()
  baseStayAmount: number;

  @Prop({ required: true })
  @IsNumber()
  @IsPositive()
  taxAmount: number;
}

export const ReservationModel = SchemaFactory.createForClass(Reservation);
