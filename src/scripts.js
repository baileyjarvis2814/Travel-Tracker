/* eslint-disable max-len */
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
import { displayLocationOptions, displayTripEstimate, displayTravelerPendingTrips, resetTripForm, displayTravelerUpcomingTrips, displayTotalSpentThisYear  } from './domUpdates.js';
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
  console.log('Fetching all data...');
  Promise.all([fetchData('travelers'), fetchData('trips'), fetchData('destinations')])
    .then((data) => {
      console.log('Data fetching completed:', data);
  
      travelerData = data[0].travelers;
      tripData = data[1].trips;
      destinationData = data[2].destinations;
  
      console.log('Travelers data:', travelerData);
      console.log('Trips data:', tripData);
      console.log('Destinations data:', destinationData);

    //   currentTraveler = travelerData[0]; // Example: Use the first traveler
    //   console.log('Current Traveler:', currentTraveler);
  
      currentTraveler = travelerData.find(traveler => traveler.id === currentTraveler.id);
      console.log('Current Traveler:', currentTraveler);
  
      if (currentTraveler) {
        tripRepo = createTripRepository(currentTraveler, tripData);
        console.log('Trip Repository:', tripRepo);
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

function handleLogin(event) {
  event.preventDefault();
  console.log('Login attempt...');
  
  const username = usernameInput.value;
  const password = passwordInput.value;
  
  console.log('Username:', username);
  console.log('Password:', password);
  
  if (username === '' || password === '') {
    console.log('Missing username or password');
    return loginError.innerHTML = 'Please enter both username and password';
  }
  
  const userId = parseInt(username.replace('traveler', ''));
  console.log('User ID:', userId);
  
  if (username.startsWith('traveler') && password === 'travel' && !isNaN(userId)) {
    fetchData(`travelers/${userId}`)
      .then((data) => {
        currentTraveler = data;
        console.log('Logged in Traveler:', currentTraveler);
  
        if (currentTraveler) {
          console.log('Login successful');
          displayDashboard();
        } else {
          console.log('Invalid username or password');
          loginError.innerHTML = 'Invalid username or password';
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        loginError.innerHTML = 'Error logging in. Please try again.';
      });
  } else {
    console.log('Invalid username or password');
    loginError.innerHTML = 'Invalid username or password';
  }
}

function displayDashboard() {
  console.log('Displaying dashboard...');
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
  console.log('Displaying dashboard for traveler:', currentTraveler);
  
  displayTrips(pastTrips, tripRepo.pastTrips);
  
  displayTravelerUpcomingTrips(tripRepo, destinationData, upcomingTrips, dayjs
    // , getTravelCost, getTotalTripCost);
  );
  displayTravelerPendingTrips(tripRepo, destinationData, pendingTrips, dayjs, getTravelCost, getTotalTripCost);

  displayTotalSpentThisYear(tripRepo, destinationData, spentBreakdown, dayjs);
}


function displayTrips(container, trips) { 
  console.log('Displaying trips in container:', container.className);
  container.innerHTML = '';
  trips.forEach(trip => {
    const destination = destinationData.find(dest => dest.id === trip.destinationID);
    console.log('Trip:', trip);
    console.log('Destination:', destination);
    container.innerHTML += `
        <div class="card">
          <h4>${destination.destination}</h4>
          <p>Date: ${dayjs(trip.date).format('MMMM D, YYYY')}</p>
          <p>Duration: ${trip.duration} days</p>
          <p>Travelers: ${trip.travelers}</p>
          <p>Status: ${trip.status}</p>
        </div>
      `;
  });
}

window.addEventListener('load', () => {
  console.log('Page loaded. Initializing...');
  hideElements([userDataOverview, travelerInfo, welcomeTraveler]);
  showElements([adventureWelcome, accountLoginForm]);
});
submitLoginButton.addEventListener('click', handleLogin);
logoutButton.addEventListener('click', handleLogout); 
displayEstimate.addEventListener('click', (event) => {
  event.preventDefault();
  console.log('Displaying trip estimate...');
  displayTripEstimate(destinationData, tripEstimate, locationOptions, calendarInput, durationInput, numberTravelersInput, errorMessage);
});
clearForm.addEventListener('click', (event) => {
  event.preventDefault();
  console.log('Clearing form...');
  resetTripForm(allInputs, tripEstimate);
});
bookTrip.addEventListener('click', (event) => {
  event.preventDefault();
  console.log('Booking new trip...');
  bookNewTrip(event);
});

function bookNewTrip(event) {
  if (locationOptions.value === '' || calendarInput.value === '' || durationInput.value === '' || numberTravelersInput.value === '') {
    return errorMessage.innerHTML = 'Please enter valid inputs in each field';
  } else {
    errorMessage.innerHTML = '';
  
    const newDestination = destinationData.find(destination => destination.id === parseInt(locationOptions.value));
    console.log('New Destination:', newDestination);
  
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
      status: "approved",
      suggestedActivities: []
    };

    console.log('New Trip:', newTrip);

    postData('trips', newTrip)
      .then(response => {
        const postedTrip = response.newTrip;
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

function handleLogout() { 
  console.log('Logging out...');
  currentTraveler = null;
  tripRepo = null;
  hideElements([welcomeTraveler, userDataOverview, travelerInfo]);
  showElements([adventureWelcome, accountLoginForm]);
  console.log('Logged out successfully.');
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
