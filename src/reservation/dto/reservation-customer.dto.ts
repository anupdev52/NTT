import { IsNumber, IsNotEmpty, IsString, Validate } from 'class-validator';
import { DateValidator } from '../validators/date.validator';

export class CreateReservationDTO {
  @IsNumber()
  @IsNotEmpty()
  guestMemberId: number;

  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsString()
  @IsNotEmpty()
  hotelName: string;

  @Validate(DateValidator)
  arrivalDate: string;

  @Validate(DateValidator)
  departureDate: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  baseStayAmount: number;

  @IsNumber()
  @IsNotEmpty()
  taxAmount: number;
}
