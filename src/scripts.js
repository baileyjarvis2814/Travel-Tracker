/* eslint-disable max-len */
import './css/styles.css';
import '../src/images/background.png';
import dayjs from 'dayjs';
import { fetchData, postData } from './apiCalls.js';
import {
  createTripRepository,
  getTravelCost,
  getTotalTripCost
} from '../src/trip-functions.js';
import { displayLocationOptions, displayTripEstimate, displayTravelerPendingTrips, resetTripForm, displayTravelerUpcomingTrips, displayTotalSpentThisYear } from './domUpdates.js';

//GLOBAL VARIABLES
let travelerData;
let tripData;
let destinationData;
let currentTraveler;
let tripRepo;

//QUERY SELECTORS
const welcomeTraveler = document.querySelector('.welcome-traveler');
const logoutButton = document.querySelector('.account-logout');
const adventureWelcome = document.querySelector('.adventure-welcome');
const accountLoginForm = document.querySelector('.account-login-form');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.querySelector('.login-error');
const submitLoginButton = document.querySelector('.login-submit-button');
const userDataOverview = document.querySelector('.traveler-data-overview');
const pastTrips = document.querySelector('.past-trips-container');
const upcomingTrips = document.querySelector('.upcoming-trips-container');
const pendingTrips = document.querySelector('.pending-trips-container');
const spentBreakdown = document.querySelector('.traveler-spent-breakdown');
const travelerInfo = document.querySelector('.traveler-account-info');
const locationOptions = document.querySelector('.location-options');
const calendarInput = document.getElementById('calendarInput');
const durationInput = document.getElementById('tripLength');
const numberTravelersInput = document.getElementById('numberTravelers');
const errorMessage = document.querySelector('.error-message');
const displayEstimate = document.querySelector('.display-estimate');
const tripEstimate = document.querySelector('.trip-estimate');
const bookTrip = document.querySelector('.book-trip');
const clearForm = document.querySelector('.new-search');
const allInputs = document.querySelectorAll('.input');

function initialize() {
  durationInput.addEventListener('input', validateInput);
  numberTravelersInput.addEventListener('input', validateInput);
  submitLoginButton.addEventListener('click', handleLogin);
  logoutButton.addEventListener('click', handleLogout);
  displayEstimate.addEventListener('click', (event) => {
    event.preventDefault();
    displayTripEstimate(destinationData, tripEstimate, locationOptions, calendarInput, durationInput, numberTravelersInput, errorMessage);
  });
  clearForm.addEventListener('click', (event) => {
    event.preventDefault();
    resetTripForm(allInputs, tripEstimate);
  });
  bookTrip.addEventListener('click', (event) => {
    event.preventDefault();
    bookNewTrip(event);
  });

  // Initialize app state
  hideElements([userDataOverview, travelerInfo, welcomeTraveler]);
  showElements([adventureWelcome, accountLoginForm]);

  const savedTraveler = localStorage.getItem('currentTraveler');
  if (savedTraveler) {
    currentTraveler = JSON.parse(savedTraveler);
    displayDashboard();
  }
}

function fetchAllData() {
  Promise.all([fetchData('travelers'), fetchData('trips'), fetchData('destinations')])
    .then((data) => {
      travelerData = data[0].travelers;
      tripData = data[1].trips;
      destinationData = data[2].destinations;

      currentTraveler = travelerData.find(traveler => traveler.id === currentTraveler.id);

      if (currentTraveler) {
        tripRepo = createTripRepository(currentTraveler, tripData);
        displayLocationOptions(destinationData, locationOptions);
        displayTravelerDashboard();
      } else {
        console.error('No current traveler found');
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

function validateInput(event) {
  if (event.target.value < 1) {
    event.target.value = 1;
  }
}

function handleLogin(event) {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (username === '' || password === '') {
    return loginError.innerHTML = 'Please enter both username and password';
  }

  const userId = parseInt(username.replace('traveler', ''));
  if (username.startsWith('traveler') && password === 'travel' && !isNaN(userId)) {
    fetchData(`travelers/${userId}`)
      .then((data) => {
        currentTraveler = data;

        if (currentTraveler) {
          localStorage.setItem('currentTraveler', JSON.stringify(currentTraveler));
          displayDashboard();
        } else {
          loginError.innerHTML = 'Invalid username or password';
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        loginError.innerHTML = 'Error logging in. Please try again.';
      });
  } else {
    loginError.innerHTML = 'Invalid username or password';
  }
}

function displayDashboard() {
  hideElements([adventureWelcome, accountLoginForm]);
  showElements([welcomeTraveler, userDataOverview, travelerInfo]);
  welcomeTraveler.innerText = `Welcome back, ${currentTraveler.name.split(' ')[0]}!`;
  fetchAllData();
}

function hideElements(elements) {
  elements.forEach(element => element.classList.add('hidden'));
}

function showElements(elements) {
  elements.forEach(element => element.classList.remove('hidden'));
}

function displayTravelerDashboard() {
  displayTrips(pastTrips, tripRepo.pastTrips);
  displayTravelerUpcomingTrips(tripRepo, destinationData, upcomingTrips, dayjs, getTravelCost, getTotalTripCost);
  displayTravelerPendingTrips(tripRepo, destinationData, pendingTrips, dayjs, getTravelCost, getTotalTripCost);
  displayTotalSpentThisYear(tripRepo, destinationData, spentBreakdown, dayjs);
}

function displayTrips(container, trips) {
  container.innerHTML = '';
  trips.forEach(trip => {
    const destination = destinationData.find(dest => dest.id === trip.destinationID);
    container.innerHTML += `
          <div class="card" tabindex="0" aria-label="Trip to ${destination.destination} on ${dayjs(trip.date).format('MMMM D, YYYY')} for ${trip.duration} days with ${trip.travelers} travelers. Status: ${trip.status}">
            <h4>${destination.destination}</h4>
            <p>Date: ${dayjs(trip.date).format('MMMM D, YYYY')}</p>
            <p>Duration: ${trip.duration} days</p>
            <p>Travelers: ${trip.travelers}</p>
            <p>Status: ${trip.status}</p>
          </div>
        `;
  });
}

function bookNewTrip(event) {
  event.preventDefault();
  if (locationOptions.value === '' || calendarInput.value === '' || durationInput.value === '' || numberTravelersInput.value === '' || durationInput.value < 1 || numberTravelersInput.value < 1) {
    errorMessage.innerHTML = 'Please enter valid inputs in each field';
    setTimeout(() => {
      errorMessage.innerHTML = ''; 
    }, 3000);
    return;
  } else {
    errorMessage.innerHTML = '';
    const selectedDate = dayjs(calendarInput.value).format('YYYY/MM/DD');
    if (dayjs(selectedDate).isBefore(dayjs(), 'day')) {
      errorMessage.innerHTML = 'You cannot book a trip in the past. Please choose a future date.';
      setTimeout(() => {
        errorMessage.innerHTML = ''; 
      }, 3000);
      return;
    }
  
    const existingApprovedTrip = tripRepo.upcomingTrips.find(trip => trip.date === selectedDate && trip.status === 'approved');
    if (existingApprovedTrip) {
      errorMessage.innerHTML = 'You already have an approved trip on this date. Please choose a different date.';
      setTimeout(() => {
        errorMessage.innerHTML = ''; 
      }, 3000);
      return;
    }
    const newDestination = destinationData.find(destination => destination.id === parseInt(locationOptions.value));
    if (!newDestination) {
      console.error('Destination not found for ID:', locationOptions.value);
      errorMessage.innerHTML = 'Selected destination not found';
      setTimeout(() => {
        errorMessage.innerHTML = ''; 
      }, 3000);
      return;
    }
    const newTrip = {
      id: Date.now(),
      userID: currentTraveler.id,
      destinationID: newDestination.id,
      travelers: numberTravelersInput.value,
      date: selectedDate,
      duration: durationInput.value,
      status: "approved", // change this to "approved" or "pending" as needed
      suggestedActivities: []
    };
    postData('trips', newTrip)
      .then(response => {
        const postedTrip = response.newTrip;
        tripRepo.allTravelerTrips.push(postedTrip);
        if (postedTrip.status === 'approved') {
          tripRepo.upcomingTrips.push(postedTrip);
          displayTravelerUpcomingTrips(tripRepo, destinationData, upcomingTrips, dayjs, getTravelCost, getTotalTripCost);
        } else if (postedTrip.status === 'pending') {
          tripRepo.pendingTrips.push(postedTrip);
          displayTravelerPendingTrips(tripRepo, destinationData, pendingTrips, dayjs, getTravelCost, getTotalTripCost);
        }
      })
      .catch(error => {
        console.error('Error posting new trip:', error);
        alert(`Error posting new trip: ${error.message}`);
      });
  }

  resetTripForm(allInputs, tripEstimate);
}

function handleLogout() {
  localStorage.removeItem('currentTraveler');
  currentTraveler = null;
  tripRepo = null;
  hideElements([welcomeTraveler, userDataOverview, travelerInfo]);
  showElements([adventureWelcome, accountLoginForm]);
}

window.addEventListener('load', initialize);
