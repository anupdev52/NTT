import * as mongoose from 'mongoose';

export const ReservationSchema = new mongoose.Schema({
  guestMemberId: { type: Number, required: true },
  guestName: { type: String, required: true },
  hotelName: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  departureDate: { type: Date, required: true },
  status: { type: String, required: true },
  baseStayAmount: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});
