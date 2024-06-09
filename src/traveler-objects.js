export const createTraveler = (travelerData) => {
  if (
    !travelerData ||
      typeof travelerData.id !== 'number' ||
      typeof travelerData.name !== 'string' ||
      typeof travelerData.travelerType !== 'string'
  ) {
    return {};
  }
  
  return {
    id: travelerData.id,
    name: travelerData.name,
    travelerType: travelerData.travelerType,
  };
};

  