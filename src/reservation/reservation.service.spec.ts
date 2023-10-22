// reservation.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.model';

const mockReservationModel = {
  find: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  findOneAndUpdate: jest.fn(),
};

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getModelToken(Reservation.name),
          useValue: mockReservationModel,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllReservations', () => {
    it('should return an array of reservations', async () => {
      const mockReservations = [
        {
          /* mock reservation data */
        },
      ] as Reservation[];
      mockReservationModel.find.mockReturnValueOnce(mockReservations);

      const result = await service.getAllReservations();

      expect(result).toEqual(mockReservations);
      expect(mockReservationModel.find).toHaveBeenCalled();
    });
  });

  describe('getReservationById', () => {
    it('should return a reservation by ID', async () => {
      const mockReservation = {
        /* mock reservation data */
      } as Reservation;
      mockReservationModel.findById.mockReturnValueOnce(mockReservation);

      const result = await service.getReservationById('mock-id');

      expect(result).toEqual(mockReservation);
      expect(mockReservationModel.findById).toHaveBeenCalledWith('mock-id');
    });
  });

  describe('createReservation', () => {
    it('should create a new reservation', async () => {
      const mockReservationDto = {
        guestMemberId: 123,
        guestName: 'John Doe',
        hotelName: 'Sample Hotel',
        arrivalDate: '2023-01-01',
        departureDate: '2023-01-05',
        status: 'active',
        baseStayAmount: 200,
        taxAmount: 50,
      };

      const createdReservation = {
        id: 'mock-id',
        ...mockReservationDto,
      };

      mockReservationModel.save.mockReturnValueOnce(createdReservation);

      const result = await service.createReservation(
        mockReservationDto as any as Reservation,
      );

      expect(result).toEqual(createdReservation);
      expect(mockReservationModel.save).toHaveBeenCalledWith(
        mockReservationDto,
      );
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation by ID', async () => {
      const mockReservationId = 'mock-id';

      const canceledReservation = {
        id: mockReservationId,
        guestMemberId: 123,
        // ... other reservation data
        status: 'cancelled',
      };

      mockReservationModel.findOneAndUpdate.mockReturnValueOnce(
        canceledReservation,
      );

      const result = await service.cancelReservation(mockReservationId);

      expect(result).toEqual(canceledReservation);
      expect(mockReservationModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockReservationId },
        { $set: { status: 'cancelled' } },
        { new: true },
      );
    });
  });

  describe('getGuestStaySummary', () => {
    it('should retrieve the guest stay summary', async () => {
      const guestMemberId = 123;

      const mockUpcomingStays = [
        {
          /* mock upcoming stay data */
        },
      ] as Reservation[];
      const mockPastStays = [
        {
          /* mock past stay data */
        },
      ] as Reservation[];
      const mockCancelledReservations = [
        {
          /* mock cancelled reservation data */
        },
      ] as Reservation[];

      mockReservationModel.find.mockReturnValueOnce(mockUpcomingStays);
      mockReservationModel.find.mockReturnValueOnce(mockPastStays);
      mockReservationModel.find.mockReturnValueOnce(mockCancelledReservations);

      const result = await service.getGuestStaySummary(guestMemberId);

      // Add assertions based on your actual logic for calculating stay summary
      // Ensure the result includes the expected properties and values
      expect(result).toBeDefined();
    });
  });

  describe('searchStaysByDateRange', () => {
    it('should search stays within a date range', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-06-30';

      const mockStaysWithinDateRange = [
        {
          /* mock stay data within date range */
        },
      ] as Reservation[];

      mockReservationModel.find.mockReturnValueOnce(mockStaysWithinDateRange);

      const result = await service.searchStaysByDateRange(
        new Date(startDate),
        new Date(endDate),
      );

      expect(result).toEqual(mockStaysWithinDateRange);
      expect(mockReservationModel.find).toHaveBeenCalledWith({
        arrivalDate: { $gte: new Date(startDate) },
        departureDate: { $lte: new Date(endDate) },
      });
    });
  });
});
