// reservation.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation } from './reservation.model';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,
  ) {}

  async getAllReservations(): Promise<Reservation[]> {
    return this.reservationModel.find().exec();
  }

  async getReservationById(id: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(id).exec();
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return reservation;
  }

  async createReservation(reservation: Reservation): Promise<Reservation> {
    const createdReservation = new this.reservationModel(reservation);
    return createdReservation.save();
  }

  async cancelReservation(id: string): Promise<Reservation> {
    const reservation = await this.getReservationById(id);
    reservation.status = 'cancelled';
    return reservation.save();
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
