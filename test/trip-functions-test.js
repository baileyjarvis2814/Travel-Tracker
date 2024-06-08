import { expect } from 'chai';
import {
  filterTripsByUser,
  sortTripsByDateDesc,
  filterPastTrips,
  filterUpcomingTrips,
  filterApprovedTrips,
  filterPendingTrips,
  getAllTravelerTrips,
  createTripRepository
} from '../src/trip-functions.js';
import { mockTrip } from '../src/mock-data/mock-trip.js';
import { mockTravelers } from '../src/mock-data/mock-traveler.js';

describe('Trip Functions', () => {
  let traveler, anotherTraveler, trips, emptyTrips;

  beforeEach(() => {
    traveler = mockTravelers[0];
    anotherTraveler = { id: 99, name: 'Nonexistent User' };
    trips = [...mockTrip];
    emptyTrips = [];
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
        expect(trip.date).to.be.at.least(dayjs().format('YYYY/MM/DD'));
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
});
