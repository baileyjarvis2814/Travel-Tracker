import { expect } from 'chai';
import dayjs from 'dayjs';
import {
  filterTripsByUser,
  sortTripsByDateDesc,
  filterPastTrips,
  filterUpcomingTrips,
  filterApprovedTrips,
  filterPendingTrips,
  getAllTravelerTrips,
  createTripRepository,
  getTravelCostForYearToDate,
  getTotalSpentForYearToDate
} from '../src/trip-functions.js';
import { mockTrip } from '../src/mock-data/mock-trip.js';
import { mockDestination } from '../src/mock-data/mock-destination.js';
import { mockTravelers } from '../src/mock-data/mock-traveler.js';

describe('Trip Functions', () => {
  let traveler, anotherTraveler, trips, emptyTrips, destinationData;

  beforeEach(() => {
    traveler = mockTravelers[0];
    anotherTraveler = { id: 99, name: 'Nonexistent User' };
    trips = [...mockTrip];
    emptyTrips = [];
    destinationData = [...mockDestination];
  });

  describe('filterTripsByUser', () => {
    it('should filter trips by user ID (happy path)', () => {
      const result = filterTripsByUser(trips, traveler.id);
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property('userID', traveler.id);
    });

    it('should return an empty array if no trips match the user ID (sad path)', () => {
      const result = filterTripsByUser(trips, anotherTraveler.id);
      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('sortTripsByDateDesc', () => {
    it('should sort trips by date in descending order (happy path)', () => {
      const result = sortTripsByDateDesc(trips);
      expect(result[0].date).to.equal('2025/03/25');
      expect(result[result.length - 1].date).to.equal('2024/06/15');
    });

    it('should return an empty array when given an empty array (sad path)', () => {
      const result = sortTripsByDateDesc(emptyTrips);
      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('filterPastTrips', () => {
    it('should filter trips to include only past trips (happy path)', () => {
      const pastTrips = trips.map(trip => ({ ...trip, date: '2000/01/01' }));
      const result = filterPastTrips(pastTrips);
      expect(result).to.be.an('array').that.has.lengthOf(pastTrips.length);
    });

    it('should return an empty array if there are no past trips (sad path)', () => {
      const futureTrips = trips.map(trip => ({ ...trip, date: '3000/01/01' }));
      const result = filterPastTrips(futureTrips);
      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('filterUpcomingTrips', () => {
    it('should filter trips to include only upcoming trips (happy path)', () => {
      const result = filterUpcomingTrips(trips);
      expect(result).to.be.an('array').that.is.not.empty;
      result.forEach(trip => {
        expect(dayjs(trip.date).isAfter(dayjs(), 'day')).to.be.true;
      });
    });

    it('should return an empty array if there are no upcoming trips (sad path)', () => {
      const pastTrips = trips.map(trip => ({ ...trip, date: '2000/01/01' }));
      const result = filterUpcomingTrips(pastTrips);
      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('filterApprovedTrips', () => {
    it('should filter trips to include only approved trips (happy path)', () => {
      const result = filterApprovedTrips(trips);
      expect(result).to.be.an('array').that.is.not.empty;
      result.forEach(trip => {
        expect(trip.status).to.equal('approved');
      });
    });

    it('should return an empty array if there are no approved trips (sad path)', () => {
      const pendingTrips = trips.map(trip => ({ ...trip, status: 'pending' }));
      const result = filterApprovedTrips(pendingTrips);
      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('filterPendingTrips', () => {
    it('should filter trips to include only pending trips (happy path)', () => {
      const result = filterPendingTrips(trips);
      expect(result).to.be.an('array').that.is.not.empty;
      result.forEach(trip => {
        expect(trip.status).to.equal('pending');
      });
    });

    it('should return an empty array if there are no pending trips (sad path)', () => {
      const approvedTrips = trips.map(trip => ({ ...trip, status: 'approved' }));
      const result = filterPendingTrips(approvedTrips);
      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('getAllTravelerTrips', () => {
    it('should get all trips for a traveler and sort them by date (happy path)', () => {
      const result = getAllTravelerTrips(traveler, trips);
      expect(result).to.be.an('array').that.is.not.empty;
      expect(result[0]).to.have.property('userID', traveler.id);
    });

    it('should return an empty array if the traveler has no trips (sad path)', () => {
      const result = getAllTravelerTrips(anotherTraveler, trips);
      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('createTripRepository', () => {
    it('should create a trip repository with correct properties (happy path)', () => {
      const tripRepository = createTripRepository(traveler, trips);
      expect(tripRepository).to.be.an('object');
      expect(tripRepository).to.have.property('allTravelerTrips').that.is.an('array');
      expect(tripRepository).to.have.property('pastTrips').that.is.an('array');
      expect(tripRepository).to.have.property('upcomingTrips').that.is.an('array');
      expect(tripRepository).to.have.property('pendingTrips').that.is.an('array');
      expect(tripRepository.allTravelerTrips[0]).to.have.property('userID', traveler.id);
    });

    it('should create an empty trip repository if the traveler has no trips (sad path)', () => {
      const tripRepository = createTripRepository(anotherTraveler, trips);
      expect(tripRepository).to.be.an('object');
      expect(tripRepository.allTravelerTrips).to.be.an('array').that.is.empty;
      expect(tripRepository.pastTrips).to.be.an('array').that.is.empty;
      expect(tripRepository.upcomingTrips).to.be.an('array').that.is.empty;
      expect(tripRepository.pendingTrips).to.be.an('array').that.is.empty;
    });
  });

  describe('getTravelCostForYearToDate', () => {
    it('should calculate the travel cost for the year to date (happy path)', () => {
      const result = getTravelCostForYearToDate(trips, destinationData, 'flightCost', 'travelers');
      expect(result).to.be.a('string');
      expect(parseFloat(result)).to.be.a('number');
    });

    it('should return 0.00 if there are no matching trips (sad path)', () => {
      const result = getTravelCostForYearToDate(emptyTrips, destinationData, 'flightCost', 'travelers');
      expect(result).to.equal('0.00');
    });
  });

  describe('getTotalSpentForYearToDate', () => {
    it('should calculate the total spent for the year to date (happy path)', () => {
      const expectedSpent = ((7 * 500 + 2 * 1000) + (5 * 150 + 4 * 400) + (8 * 250 + 3 * 300) + (9 * 100 + 1 * 1200)) * 1.1;
      const result = getTotalSpentForYearToDate(trips, destinationData);
      console.log('Expected Spent:', expectedSpent); // Add logging to inspect expectedSpent
      console.log('Result:', result); // Add logging to inspect result
      expect(result).to.equal(expectedSpent.toFixed(2));
    });
  
    it('should return 0.00 if there are no matching trips (sad path)', () => {
      const result = getTotalSpentForYearToDate(emptyTrips, destinationData);
      expect(result).to.equal('0.00');
    });
  });
});

