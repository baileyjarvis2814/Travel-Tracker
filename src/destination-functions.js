const createDestination = (destinationData) => {
  return {
    id: destinationData.id,
    destination: destinationData.destination,
    lodgingCost: destinationData.estimatedLodgingCostPerDay,
    flightCost: destinationData.estimatedFlightCostPerPerson,
    image: destinationData.image,
    alt: destinationData.alt,
  };
};
    
export default createDestination;