import { expect } from 'chai';
import createDestination from '../src/destination-functions.js';

describe('createDestination', () => {
  it('should create a destination object with correct properties', () => {
    const destinationData = {
      id: 1,
      destination: 'Paris',
      estimatedLodgingCostPerDay: 100,
      estimatedFlightCostPerPerson: 200,
      image: 'paris.jpg',
      alt: 'Eiffel Tower'
    };
    const destination = createDestination(destinationData);

    expect(destination).to.be.an('object');
    expect(destination).to.have.property('id', 1);
    expect(destination).to.have.property('destination', 'Paris');
    expect(destination).to.have.property('lodgingCost', 100);
    expect(destination).to.have.property('flightCost', 200);
    expect(destination).to.have.property('image', 'paris.jpg');
    expect(destination).to.have.property('alt', 'Eiffel Tower');
  });
});
