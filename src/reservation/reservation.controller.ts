// reservation.controller.ts

import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.model';
import { SearchStaysDto } from './dto/reservation.request.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  getAllReservations(): Promise<Reservation[]> {
    return this.reservationService.getAllReservations();
  }

  @Get(':id')
  getReservationById(@Param('id') id: string): Promise<Reservation> {
    return this.reservationService.getReservationById(id);
  }

  @Post()
  createReservation(@Body() reservation: Reservation): Promise<Reservation> {
    return this.reservationService.createReservation(reservation);
  }

  @Delete(':id')
  cancelReservation(@Param('id') id: string): Promise<Reservation> {
    return this.reservationService.cancelReservation(id);
  }

  @Get('guest-stay-summary/:guestMemberId')
  getGuestStaySummary(
    @Param('guestMemberId') guestMemberId: number,
  ): Promise<any> {
    return this.reservationService.getGuestStaySummary(guestMemberId);
  }

  @Get('search-stays')
  searchStaysByDateRange(
    @Query() { end, start }: SearchStaysDto,
  ): Promise<Reservation[]> {
    const startDate = new Date(start);
    const endDate = new Date(end);

    return this.reservationService.searchStaysByDateRange(startDate, endDate);
  }
}
