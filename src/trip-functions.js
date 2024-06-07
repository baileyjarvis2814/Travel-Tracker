const createTrip = (tripData) => {
  if (
    !tripData ||
      typeof tripData.id !== 'number' ||
      typeof tripData.userID !== 'number' ||
      typeof tripData.destinationID !== 'number' ||
      typeof tripData.travelers !== 'number' ||
      typeof tripData.date !== 'string' ||
      typeof tripData.duration !== 'number' ||
      typeof tripData.status !== 'string' ||
      !Array.isArray(tripData.suggestedActivities)
  ) {
    return {};
  }
  
  return {
    id: tripData.id,
    userID: tripData.userID,
    destinationID: tripData.destinationID,
    travelers: tripData.travelers,
    date: tripData.date,
    duration: tripData.duration,
    status: tripData.status,
    suggestedActivities: tripData.suggestedActivities,
  };
};
  
export default createTrip;
  
  