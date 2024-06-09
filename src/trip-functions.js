/* eslint-disable max-len */
import dayjs from 'dayjs';

export const filterTripsByUser = (tripData, userId) => tripData.filter(trip => trip.userID === userId);

export const sortTripsByDateDesc = (trips) => trips.sort((first, last) => dayjs(last.date).valueOf() - dayjs(first.date).valueOf());

export const filterPastTrips = (trips) => trips.filter(trip => dayjs(trip.date).format('YYYY/MM/DD') < dayjs().format('YYYY/MM/DD'));

export const filterUpcomingTrips = (trips) => trips.filter(trip => dayjs(trip.date).format('YYYY/MM/DD') >= dayjs().format('YYYY/MM/DD'));

export const filterApprovedTrips = (trips) => trips.filter(trip => trip.status === 'approved');

export const filterPendingTrips = (trips) => trips.filter(trip => trip.status === 'pending');

export const getAllTravelerTrips = (traveler, tripData) => sortTripsByDateDesc(filterTripsByUser(tripData, traveler.id));

const filterTripsByYearAndStatus = (trips, year, status) =>
  trips.filter(trip => dayjs(trip.date).year() === year && trip.status === status);

export const getTravelCostForYearToDate = (trips, destinationData, cost, multiplier) => {
  const currentYear = dayjs().year();
  const filteredTrips = filterTripsByYearAndStatus(trips, currentYear, 'approved');
  
  const travelCost = filteredTrips.reduce((total, trip) => {
    const destination = destinationData.find(dest => dest.id === trip.destinationID);
    if (destination) {
      return total + trip[multiplier] * destination[cost];
    }
    return total;
  }, 0);
  
  return travelCost.toFixed(2);
};

export const getTotalSpentForYearToDate = (trips, destinationData) => {
  const currentYear = dayjs().year();
  const filteredTrips = filterTripsByYearAndStatus(trips, currentYear, 'approved');
  
  const spentThisYear = filteredTrips.reduce((total, trip) => {
    const destination = destinationData.find(dest => dest.id === trip.destinationID);
    if (destination) {
      const tripCost = (trip.duration * destination.estimatedLodgingCostPerDay) + (trip.travelers * destination.estimatedFlightCostPerPerson);
      console.log('Trip Cost:', tripCost);
      return total + tripCost;
    }
    return total;
  }, 0);
  
  console.log('Total Spent This Year:', spentThisYear);
  
  return (spentThisYear * 1.1).toFixed(2);
};

export const createTripRepository = (traveler, tripData) => {
  const allTravelerTrips = getAllTravelerTrips(traveler, tripData);
  const pastTrips = filterPastTrips(allTravelerTrips);
  const upcomingTrips = filterApprovedTrips(filterUpcomingTrips(allTravelerTrips));
  const pendingTrips = filterPendingTrips(filterUpcomingTrips(allTravelerTrips));

  return {
    allTravelerTrips,
    pastTrips,
    upcomingTrips,
    pendingTrips,
  };
};
