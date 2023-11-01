import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  NotFoundException,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDTO } from './dto/reservation-customer.dto';
import { Reservation } from './interfaces/reservation.interface';
import { SearchStaysDto } from './dto/search-stays.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  // create a reservation
  @Post('')
  async createReservation(
    @Res() res,
    @Body() createReservationDTO: CreateReservationDTO,
  ) {
    const reservation = await this.reservationService.createReservation(
      createReservationDTO,
    );
    return res.status(HttpStatus.CREATED).json({
      message: 'Reservation has been created successfully',
      reservation,
    });
  }

  // fetch the stays on behalf of start and end date
  @Get('search-stays')
  searchStaysByDateRange(
    @Query() { end, start }: SearchStaysDto,
  ): Promise<Reservation[]> {
    const startDate = new Date(start);
    const endDate = new Date(end);

    return this.reservationService.searchStaysByDateRange(startDate, endDate);
  }

  // Retrieve reservation list
  @Get('')
  async getAllReservations() {
    return this.reservationService.getAllReservations();
  }

  // Fetch a particular reservation using ID
  @Get(':id')
  async getReservationById(@Param('id') id) {
    const reservation = await this.reservationService.getReservationsById(id);

    if (!reservation) {
      throw new NotFoundException('Reservation does not exist!');
    }

    return reservation;
  }

  // Fetch summary for a particular guest with a member Id
  @Get('guest-stay-summary/:guestMemberId')
  getGuestStaySummary(
    @Param('guestMemberId') guestMemberId: number,
  ): Promise<any> {
    return this.reservationService.getGuestStaySummary(guestMemberId);
  }

  // Delete a reservation
  @Delete(':id')
  async deleteReservation(@Res() res, @Param('id') id) {
    const reservation = await this.reservationService.cancelReservation(id);

    if (!reservation) {
      throw new NotFoundException('Customer does not exist');
    }

    return res.status(HttpStatus.OK).json({
      message: 'Reservation has been deleted',
      reservation,
    });
  }
}
