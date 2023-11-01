import { IsDateString, Validate } from 'class-validator';
import { DateValidator } from '../validators/date.validator';

export class SearchStaysDto {
  @IsDateString()
  @Validate(DateValidator)
  start: string;

  @IsDateString()
  @Validate(DateValidator)
  end: string;
}
