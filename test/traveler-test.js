import { expect } from 'chai';
import createTraveler from '../src/traveler-objects.js';
import { mockTravelers } from '../src/mock-data/mock-Traveler.js';

describe('createTraveler', () => {
  let validTravelerData, invalidTravelerData;

  beforeEach(() => {
    validTravelerData = mockTravelers[0];
    invalidTravelerData = {};
  });

  it('should create a traveler object with correct properties', () => {
    const traveler = createTraveler(validTravelerData);

    expect(traveler).to.be.an('object');
    expect(traveler).to.have.property('id', 1);
    expect(traveler).to.have.property('name', 'Peter Parker');
    expect(traveler).to.have.property('travelerType', 'adventurer');
  });

  it('should handle invalid data gracefully', () => {
    const traveler = createTraveler(invalidTravelerData);

    expect(traveler).to.be.an('object');
    expect(traveler).to.not.have.property('id');
    expect(traveler).to.not.have.property('name');
    expect(traveler).to.not.have.property('travelerType');
  });
});
