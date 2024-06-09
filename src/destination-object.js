export const createDestination = (destinationData) => {
  if (
    !destinationData ||
      typeof destinationData.id !== 'number' ||
      typeof destinationData.destination !== 'string' ||
      typeof destinationData.estimatedLodgingCostPerDay !== 'number' ||
      typeof destinationData.estimatedFlightCostPerPerson !== 'number' ||
      typeof destinationData.image !== 'string' ||
      typeof destinationData.alt !== 'string'
  ) {
    return {};
  }
  
  return {
    id: destinationData.id,
    destination: destinationData.destination,
    lodgingCost: destinationData.estimatedLodgingCostPerDay,
    flightCost: destinationData.estimatedFlightCostPerPerson,
    image: destinationData.image,
    alt: destinationData.alt,
  };
};
  
  