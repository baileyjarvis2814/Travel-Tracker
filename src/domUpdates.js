/* eslint-disable max-len */
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
  
    console.log('Selected Destination:', getDestination);
  
    const lodgingCost = getDestination.estimatedLodgingCostPerDay;
    const flightCost = getDestination.estimatedFlightCostPerPerson;
    const duration = parseInt(durationInput.value);
    const numberOfTravelers = parseInt(numberTravelersInput.value);
  
    const getEstimate = ((lodgingCost * duration) + (flightCost * numberOfTravelers)) * 1.1;
  
    console.log('Lodging Cost:', lodgingCost);
    console.log('Flight Cost:', flightCost);
    console.log('Duration:', duration);
    console.log('Number of Travelers:', numberOfTravelers);
    console.log('Estimated Cost:', getEstimate);
  
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
        <div class="card single-pending-trip">
          <img class="image-card" src="${destination.image}" alt="${destination.alt}"/>
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

export function resetTripForm(allInputs, tripEstimate) {
  allInputs.forEach(input => input.value = '');
  tripEstimate.innerHTML = '';
}