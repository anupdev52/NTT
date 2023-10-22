import { IsDateString } from 'class-validator';

export class SearchStaysDto {
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;
}
