/* eslint-disable max-len */
import { expect } from 'chai';
import { createTrip } from '../src/trip-object.js';
import { mockTrip } from '../src/mock-data/mock-trip.js';

describe('createTrip', () => {
  let validTripData, anotherValidTripData, invalidTripData;

  beforeEach(() => {
    const mockTripCopy = mockTrip
    validTripData = mockTripCopy[0];
    anotherValidTripData = mockTripCopy[1];
    invalidTripData = {};
  });

  it('should create a trip object with correct properties (happy path)', () => {
    const trip = createTrip(validTripData);

    expect(trip).to.be.an('object');
    expect(trip).to.have.property('id', 1);
    expect(trip).to.have.property('userID', 1);
    expect(trip).to.have.property('destinationID', 1);
    expect(trip).to.have.property('travelers', 2);
    expect(trip).to.have.property('date', '2024/06/15');
    expect(trip).to.have.property('duration', 7);
    expect(trip).to.have.property('status', 'approved');
    expect(trip).to.have.property('suggestedActivities').that.includes('snorkeling');
  });

  it('should create another trip object with correct properties (happy path)', () => {
    const trip = createTrip(anotherValidTripData);

    expect(trip).to.be.an('object');
    expect(trip).to.have.property('id', 2);
    expect(trip).to.have.property('userID', 2);
    expect(trip).to.have.property('destinationID', 2);
    expect(trip).to.have.property('travelers', 1);
    expect(trip).to.have.property('date', '2024/07/20');
    expect(trip).to.have.property('duration', 10);
    expect(trip).to.have.property('status', 'pending');
    expect(trip).to.have.property('suggestedActivities').that.includes('museum visit');
  });

  it('should handle invalid data gracefully (sad path)', () => {
    const trip = createTrip(invalidTripData);

    expect(trip).to.be.an('object');
    expect(trip).to.not.have.property('id');
    expect(trip).to.not.have.property('userID');
    expect(trip).to.not.have.property('destinationID');
    expect(trip).to.not.have.property('travelers');
    expect(trip).to.not.have.property('date');
    expect(trip).to.not.have.property('duration');
    expect(trip).to.not.have.property('status');
    expect(trip).to.not.have.property('suggestedActivities');
  });

  it('should handle another set of invalid data gracefully (sad path)', () => {
    const invalidTripData2 = { id: 'invalid', userID: 'wrong', destinationID: null, travelers: 'invalid', date: 12345, duration: 'wrong', status: false, suggestedActivities: 'not an array' };
    const trip = createTrip(invalidTripData2);

    expect(trip).to.be.an('object');
    expect(trip).to.not.have.property('id');
    expect(trip).to.not.have.property('userID');
    expect(trip).to.not.have.property('destinationID');
    expect(trip).to.not.have.property('travelers');
    expect(trip).to.not.have.property('date');
    expect(trip).to.not.have.property('duration');
    expect(trip).to.not.have.property('status');
    expect(trip).to.not.have.property('suggestedActivities');
  });
});
