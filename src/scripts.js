import './css/styles.css';
import '../src/images/background.png'
import dayjs from 'dayjs';
import { fetchData, postData } from './apiCalls.js';
import { createTraveler } from './traveler-objects.js';
import {
  filterTripsByUser,
  sortTripsByDateDesc,
  createTripRepository,
  getTravelCostForYearToDate,
  getTotalSpentForYearToDate,
  getTravelCost,
  getTotalTripCost
} from '../src/trip-functions.js';
import { createDestination } from './destination-object.js';
import { displayLocationOptions, displayTripEstimate, displayTravelerPendingTrips, resetTripForm } from './domUpdates.js';
import { createTrip } from './trip-object.js';

//GLOBAL VARIABLES
let travelerData;
let tripData;
let destinationData;
let currentTraveler;
let tripRepo;

//QUERY SELECTORS
const loginFormButton = document.querySelector('.login-form-button');
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


function fetchAllData() {
  // console.log('Fetching all data...');
  Promise.all([fetchData('travelers'), fetchData('trips'), fetchData('destinations')])
    .then((data) => {
      console.log('Data fetching completed:', data);
  
      travelerData = data[0].travelers;
      tripData = data[1].trips;
      destinationData = data[2].destinations;
  
      console.log('Travelers data:', travelerData);
      console.log('Trips data:', tripData);
      console.log('Destinations data:', destinationData);
  
      currentTraveler = travelerData[0];
      console.log('Current Traveler:', currentTraveler);
  
      if (currentTraveler) {
        // console.log('Displaying traveler dashboard...');
        // displayTravelerDashboard();
        tripRepo = createTripRepository(currentTraveler, tripData);
        console.log('Trip Repository:', tripRepo);
        // initialize();
  
        displayLocationOptions(destinationData, locationOptions);
      } else {
        console.error('No current traveler found');
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

window.addEventListener('load', fetchAllData);
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

function bookNewTrip(event) {
  if (locationOptions.value === '' || calendarInput.value === '' || durationInput.value === '' || numberTravelersInput.value === '') {
    return errorMessage.innerHTML = 'Please enter valid inputs in each field';
  } else {
    errorMessage.innerHTML = '';
  
    const newDestination = destinationData.find(destination => destination.id === parseInt(locationOptions.value));
    console.log('New Destination:', newDestination); // Added for debugging
  
    if (!newDestination) {
      console.error('Destination not found for ID:', locationOptions.value);
      return errorMessage.innerHTML = 'Selected destination not found';
    }
  
    const newTrip = {
      id: Date.now(),
      userID: currentTraveler.id,
      destinationID: newDestination.id,
      travelers: numberTravelersInput.value,
      date: dayjs(calendarInput.value).format('YYYY/MM/DD'),
      duration: durationInput.value,
      status: "pending",
      suggestedActivities: []
    };
  
    postData('trips', newTrip)
      .then(response => {
        const postedTrip = response.newTrip; // Extracting the new trip from the response
        console.log('Posted Trip:', postedTrip);
  
        tripRepo.allTravelerTrips.push(postedTrip);
        tripRepo.pendingTrips.push(postedTrip);
        displayTravelerPendingTrips(tripRepo, destinationData, pendingTrips, dayjs, getTravelCost, getTotalTripCost);
      })
      .catch(error => {
        console.error('Error posting new trip:', error);
        alert(`Error posting new trip: ${error.message}`);
      });
  }
  
  resetTripForm(allInputs, tripEstimate);
}

// function initialize() {
//   console.log('Initializing application...');
//   // Initialization logic here
// }

// function displayTravelerDashboard() {
//   console.log('Displaying traveler dashboard...');
//   // Display logic here
// }


// fetchAllData();
