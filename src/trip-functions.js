const createTrip = (tripData) => {
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
  