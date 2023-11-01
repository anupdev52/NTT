import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation } from './interfaces/reservation.interface';
import { CreateReservationDTO } from './dto/reservation-customer.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel('Reservation')
    private readonly reservationModel: Model<Reservation>,
  ) {}

  // fetch all reservations
  async getAllReservations(): Promise<Reservation[]> {
    const reservations = await this.reservationModel
      .find({ status: 'active' })
      .exec();
    return reservations;
  }

  // Get a single reservations
  async getReservationsById(reservationID): Promise<Reservation> {
    const reservation = await this.reservationModel
      .findById(reservationID)
      .exec();
    return reservation;
  }

  // post a single reservations
  async createReservation(
    createReservationDTO: CreateReservationDTO,
  ): Promise<Reservation> {
    const newReservation = new this.reservationModel(createReservationDTO);
    return newReservation.save();
  }

  // Delete a reservations
  async cancelReservation(reservationID): Promise<any> {
    const reservation = await this.getReservationById(reservationID);
    reservation.status = 'cancelled';
    return reservation.save();
  }

  async getReservationById(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findOne({ _id: id }).exec();
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return reservation;
  }

  async getGuestStaySummary(guestMemberId: number): Promise<any> {
    const [upcomingStays, pastStays, cancelledStays] = await Promise.all([
      this.reservationModel
        .find({ guestMemberId, arrivalDate: { $gte: new Date() } })
        .exec(),
      this.reservationModel
        .find({ guestMemberId, departureDate: { $lt: new Date() } })
        .exec(),
      this.reservationModel.find({ guestMemberId, status: 'cancelled' }).exec(),
    ]);

    const calculateTotalAmount = (stays: Reservation[]): number => {
      return stays.reduce(
        (total, stay) => total + stay.baseStayAmount + stay.taxAmount,
        0,
      );
    };

    return {
      guestMemberId,
      upcomingStayInfo: {
        numberOfStays: upcomingStays.length,
        totalNights: upcomingStays.reduce(
          (total, stay) => total + this.calculateNightDifference(stay),
          0,
        ),
        totalAmount: calculateTotalAmount(upcomingStays),
      },
      pastStayInfo: {
        numberOfStays: pastStays.length,
        totalNights: pastStays.reduce(
          (total, stay) => total + this.calculateNightDifference(stay),
          0,
        ),
        totalAmount: calculateTotalAmount(pastStays),
      },
      cancelledStayInfo: {
        numberOfStays: cancelledStays.length,
      },
      totalStaysAmount: calculateTotalAmount([...upcomingStays, ...pastStays]),
    };
  }

  async searchStaysByDateRange(start: Date, end: Date): Promise<Reservation[]> {
    return this.reservationModel
      .find({
        arrivalDate: { $gte: start },
        departureDate: { $lt: end },
      })
      .exec();
  }

  private calculateNightDifference(stay: Reservation): number {
    const arrivalDate = new Date(stay.arrivalDate);
    const departureDate = new Date(stay.departureDate);
    const timeDifference = departureDate.getTime() - arrivalDate.getTime();
    const nightDifference = timeDifference / (1000 * 3600 * 24);
    return nightDifference;
  }
}
