import { expect } from 'chai';
import createTraveler from '../src/user-functions.js';

describe('createTraveler', () => {
  it('should create a traveler object with correct properties', () => {
    const travelerData = {
      id: 1,
      name: 'John Doe',
      travelerType: 'business'
    };
    const traveler = createTraveler(travelerData);

    expect(traveler).to.be.an('object');
    expect(traveler).to.have.property('id', 1);
    expect(traveler).to.have.property('name', 'John Doe');
    expect(traveler).to.have.property('travelerType', 'business');
  });
});
