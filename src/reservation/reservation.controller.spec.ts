// reservation.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Reservation } from './interfaces/reservation.interface';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

const mockReservationService = {
  getAllReservations: jest.fn(),
  getReservationById: jest.fn(),
  createReservation: jest.fn(),
  cancelReservation: jest.fn(),
  getGuestStaySummary: jest.fn(),
  searchStaysByDateRange: jest.fn(),
};

describe('ReservationController', () => {
  let controller: ReservationController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: mockReservationService,
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();

    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllReservations', () => {
    it('should return an array of reservations', async () => {
      const mockReservations = [
        {
          /* mock reservation data */
        },
      ] as Reservation[];
      mockReservationService.getAllReservations.mockReturnValueOnce(
        mockReservations,
      );

      const result = await controller.getAllReservations();

      expect(result).toEqual(mockReservations);
      expect(mockReservationService.getAllReservations).toHaveBeenCalled();
    });
  });

  describe('POST /reservations', () => {
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

      mockReservationService.createReservation.mockReturnValueOnce(
        createdReservation,
      );

      const response = await request(app.getHttpServer())
        .post('/reservations')
        .send(mockReservationDto)
        .expect(201); // Expecting a successful creation status code

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Reservation has been created successfully',
        }),
      );
      expect(mockReservationService.createReservation).toHaveBeenCalledWith(
        mockReservationDto,
      );
    });
  });

  describe('DELETE /reservations/:id', () => {
    it('should cancel a reservation by ID', async () => {
      const mockReservationId = 'mock-id';

      const canceledReservation = {
        message: 'Reservation has been deleted',
        reservation: {
          id: mockReservationId,
          guestMemberId: 123,
          status: 'cancelled',
        },
      };

      mockReservationService.cancelReservation.mockReturnValueOnce(
        canceledReservation,
      );

      const response = await request(app.getHttpServer())
        .delete(`/reservations/${mockReservationId}`)
        .expect(200); // Expecting a successful status code

      expect(response.body).toEqual(
        expect.objectContaining({
          message: canceledReservation.message,
        }),
      );
      expect(mockReservationService.cancelReservation).toHaveBeenCalledWith(
        mockReservationId,
      );
    });
  });

  describe('GET /guest-stay-summary/:guestMemberId', () => {
    it('should retrieve the guest stay summary', async () => {
      const guestMemberId = 123;

      const mockStaySummary = {
        guestMemberId,
        upcomingStays: [
          {
            /* mock upcoming stay data */
          },
        ],
        pastStays: [
          {
            /* mock past stay data */
          },
        ],
        cancelledReservations: [
          {
            /* mock cancelled reservation data */
          },
        ],
        // ... other stay summary properties
      };

      mockReservationService.getGuestStaySummary.mockReturnValueOnce(
        mockStaySummary,
      );

      const response = await request(app.getHttpServer())
        .get(`/reservations/guest-stay-summary/${guestMemberId}`)
        .expect(200); // Expecting a successful status code

      expect(response.body).toEqual(mockStaySummary);
      expect(mockReservationService.getGuestStaySummary).toHaveBeenCalledWith(
        `${guestMemberId}`,
      );
    });
  });

  describe('GET /stays/search', () => {
    it('should search stays within a date range', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-06-30';

      const mockStaysWithinDateRange = [
        {
          /* mock stay data within date range */
        },
      ];

      mockReservationService.searchStaysByDateRange.mockReturnValueOnce(
        mockStaysWithinDateRange,
      );

      const response = await request(app.getHttpServer())
        .get(`/reservations/search-stays?start=${startDate}&end=${endDate}`)
        .expect(200); // Expecting a successful status code

      expect(response.body).toEqual(mockStaysWithinDateRange);
    });
  });
});
