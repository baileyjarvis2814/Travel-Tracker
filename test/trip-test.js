import { expect } from 'chai';
import createTrip from '../src/trip-functions.js';

describe('createTrip', () => {
  it('should create a trip object with correct properties', () => {
    const tripData = {
      id: 1,
      userID: 2,
      destinationID: 3,
      travelers: 4,
      date: '2024-06-06',
      duration: 7,
      status: 'approved',
      suggestedActivities: ['hiking', 'swimming']
    };
    const trip = createTrip(tripData);

    expect(trip).to.be.an('object');
    expect(trip).to.have.property('id', 1);
    expect(trip).to.have.property('userID', 2);
    expect(trip).to.have.property('destinationID', 3);
    expect(trip).to.have.property('travelers', 4);
    expect(trip).to.have.property('date', '2024-06-06');
    expect(trip).to.have.property('duration', 7);
    expect(trip).to.have.property('status', 'approved');
    expect(trip).to.have.property('suggestedActivities')
      .that.includes('hiking');
    expect(trip).to.have.property('suggestedActivities')
      .that.includes('swimming');
  });
});
