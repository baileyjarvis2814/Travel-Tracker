import { expect } from 'chai';
import createTrip from '../src/trip-functions.js';
import { mockTrip } from '../src/mock-data/mock-trip.js';

describe('createTrip', () => {
  let validTripData, invalidTripData;

  beforeEach(() => {
    validTripData = mockTrip[0];
    invalidTripData = {};
  });

  it('should create a trip object with correct properties', () => {
    const trip = createTrip(validTripData);

    expect(trip).to.be.an('object');
    expect(trip).to.have.property('id', 1);
    expect(trip).to.have.property('userID', 1);
    expect(trip).to.have.property('destinationID', 1);
    expect(trip).to.have.property('travelers', 2);
    expect(trip).to.have.property('date', '2024/06/15');
    expect(trip).to.have.property('duration', 7);
    expect(trip).to.have.property('status', 'approved');
    expect(trip).to.have.property('suggestedActivities')
      .that.includes('snorkeling');
  });

  it('should handle invalid data gracefully', () => {
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
});
