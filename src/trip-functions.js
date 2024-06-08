/* eslint-disable max-len */
import dayjs from 'dayjs';

export const filterTripsByUser = (tripData, userId) => tripData.filter(trip => trip.userID === userId);

export const sortTripsByDateDesc = (trips) => trips.sort((first, last) => dayjs(last.date).valueOf() - dayjs(first.date).valueOf());

export const filterPastTrips = (trips) => trips.filter(trip => dayjs(trip.date).format('YYYY/MM/DD') < dayjs().format('YYYY/MM/DD'));

export const filterUpcomingTrips = (trips) => trips.filter(trip => dayjs(trip.date).format('YYYY/MM/DD') >= dayjs().format('YYYY/MM/DD'));

export const filterApprovedTrips = (trips) => trips.filter(trip => trip.status === 'approved');

export const filterPendingTrips = (trips) => trips.filter(trip => trip.status === 'pending');

export const getAllTravelerTrips = (traveler, tripData) => sortTripsByDateDesc(filterTripsByUser(tripData, traveler.id));

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
