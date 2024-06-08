import { expect } from 'chai';
import createDestination from '../src/destination-object.js';
import { mockDestination } from '../src/mock-data/mock-destination.js';

describe('createDestination', () => {
  let validDestinationData, invalidDestinationData;

  beforeEach(() => {
    validDestinationData = mockDestination[0];
    invalidDestinationData = {};
  });

  it('should create a destination object with correct properties', () => {
    const destination = createDestination(validDestinationData);

    expect(destination).to.be.an('object');
    expect(destination).to.have.property('id', 1);
    expect(destination).to.have.property('destination', 'Wakanda');
    expect(destination).to.have.property('lodgingCost', 500);
    expect(destination).to.have.property('flightCost', 1000);
    expect(destination).to.have.property('image', 'wakanda.jpg');
    expect(destination).to.have.property('alt', 'Wakanda Landscape');
  });

  it('should handle invalid data gracefully', () => {
    const destination = createDestination(invalidDestinationData);

    expect(destination).to.be.an('object');
    expect(destination).to.not.have.property('id');
    expect(destination).to.not.have.property('destination');
    expect(destination).to.not.have.property('lodgingCost');
    expect(destination).to.not.have.property('flightCost');
    expect(destination).to.not.have.property('image');
    expect(destination).to.not.have.property('alt');
  });
});

