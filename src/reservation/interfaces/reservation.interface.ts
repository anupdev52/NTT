import { Document } from 'mongoose';

export interface Reservation extends Document {
  guestMemberId: number;
  guestName: string;
  hotelName: string;
  arrivalDate: Date;
  departureDate: Date;
  status: string;
  baseStayAmount: number;
  taxAmount: number;
  created_at: Date;
}
