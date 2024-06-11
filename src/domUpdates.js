/* eslint-disable max-len */
import { getTravelCost, getTotalTripCost, getTotalSpentForYearToDate } from '../src/trip-functions.js';

export function displayLocationOptions(destinationData, locationOptions) {
  locationOptions.innerHTML = '';
  destinationData.forEach(destination => {
    locationOptions.innerHTML += `
        <option value="${destination.id}">${destination.destination}</option>`;
  });
}

export function displayTripEstimate(destinationData, tripEstimate, destinationInput, calendarInput, durationInput, numberTravelersInput, errorMessage) {
  if (destinationInput.value === '' || calendarInput.value === '' || durationInput.value === '' || numberTravelersInput.value === '') {
    return errorMessage.innerHTML = 'Please enter valid inputs in each field';
  } else {
    errorMessage.innerHTML = '';
  
    const getDestination = destinationData.find(destination => destination.id === parseInt(destinationInput.value));
  
    if (!getDestination) {
      return errorMessage.innerHTML = 'Selected destination not found';
    }
  
    const lodgingCost = getDestination.estimatedLodgingCostPerDay;
    const flightCost = getDestination.estimatedFlightCostPerPerson;
    const duration = parseInt(durationInput.value);
    const numberOfTravelers = parseInt(numberTravelersInput.value);
  
    const getEstimate = ((lodgingCost * duration) + (flightCost * numberOfTravelers)) * 1.1;
  
    tripEstimate.innerHTML = `$ ${getEstimate.toFixed(2)}`;
  }
}
  

export function displayTravelerPendingTrips(tripRepo, destinationData, pendingTrips, dayjs, getTravelCost, getTotalTripCost) {
    pendingTrips.innerHTML = '';
    tripRepo.pendingTrips.forEach(trip => {
      const destination = destinationData.find(destination => trip.destinationID === destination.id);
      if (!destination) {
        console.error('Destination not found for trip:', trip);
        return;
      }
      pendingTrips.innerHTML += `
        <div class="card single-pending-trip" tabindex="0" aria-label="Pending trip to ${destination.destination} on ${dayjs(trip.date).format('MMMM D, YYYY')} for ${trip.duration} days with ${trip.travelers} travelers. Status: ${trip.status}">
          <img class="image-card" src="${destination.image}" alt="${destination.alt}" width="100" height="50"/>
          <h4 class="location-name">${destination.destination}</h4>
          <sub>Trip Date: ${dayjs(trip.date).format('M/D/YYYY')}</sub>
          <sub>Travelers on This Trip: ${trip.travelers}</sub>
          <sub>Trip Length: ${trip.duration} days</sub>
          <sub>Trip Lodging Cost: $ ${(destination.estimatedLodgingCostPerDay * trip.duration).toFixed(2)}</sub>
          <sub>Trip Flight Cost: $ ${(destination.estimatedFlightCostPerPerson * trip.travelers).toFixed(2)}</sub>
          <sub>Total Cost of Trip: $ ${getTotalTripCost(destination, trip)}</sub>
          <br><sub>${trip.status.toUpperCase()}</sub>
        </div>`;
    });
  }
  
  export function displayTravelerUpcomingTrips(tripRepo, destinationData, upcomingTripsContainer, dayjs, getTotalTripCost) {
    upcomingTripsContainer.innerHTML = '';
    tripRepo.upcomingTrips.forEach(trip => {
      const destination = destinationData.find(destination => trip.destinationID === destination.id);
      
      if (destination) {
        const lodgingCost = destination.estimatedLodgingCostPerDay * trip.duration;
        const flightCost = destination.estimatedFlightCostPerPerson * trip.travelers;
        const totalCost = getTotalTripCost(destination, trip);
  
        upcomingTripsContainer.innerHTML += `
          <div class="card single-upcoming-trip" tabindex="0" aria-label="Upcoming trip to ${destination.destination} on ${dayjs(trip.date).format('MMMM D, YYYY')} for ${trip.duration} days with ${trip.travelers} travelers. Status: ${trip.status}">
            <img class="image-card" src="${destination.image}" alt="${destination.alt}" width="100" height="50"/>
            <h4 class="location-name">${destination.destination}</h4>
            <sub>Trip Date: ${dayjs(trip.date).format('M/D/YYYY')}</sub>
            <sub>Travelers on This Trip: ${trip.travelers}</sub>
            <sub>Trip Length: ${trip.duration} days</sub>
            <sub>Trip Lodging Cost: $ ${lodgingCost.toFixed(2)}</sub>
            <sub>Trip Flight Cost: $ ${flightCost.toFixed(2)}</sub>
            <sub>Total Cost of Trip: $ ${totalCost}</sub>
            <br><sub>${trip.status.toUpperCase()}</sub>
          </div>`;
      }
    });
  }

export function displayTotalSpentThisYear(tripRepo, destinationData, spentBreakdown) {
  const totalSpent = getTotalSpentForYearToDate(tripRepo.allTravelerTrips, destinationData);
    
  spentBreakdown.innerHTML = `
      <div class="total-spent-container">
        <h4>Total Spent This Year</h4>
        <p class="total-spent">$ ${totalSpent}</p>
      </div>
    `;
}

export function resetTripForm(allInputs, tripEstimate) {
  allInputs.forEach(input => input.value = '');
  tripEstimate.innerHTML = '';
}