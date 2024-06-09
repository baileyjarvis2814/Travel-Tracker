import './css/styles.css';
import '../src/images/background.png'
import dayjs from 'dayjs';
import { fetchData, postData } from './apiCalls.js';
import { createTraveler } from './traveler-objects.js';
import {
  filterTripsByUser,
  sortTripsByDateDesc,
  filterPastTrips,
  filterUpcomingTrips,
  filterApprovedTrips,
  filterPendingTrips,
  getAllTravelerTrips,
  createTripRepository,
  getTravelCostForYearToDate,
  getTotalSpentForYearToDate
} from '../src/trip-functions.js';
import { createDestination } from './destination-object.js';
import { createTrip } from './trip-object.js';

//GLOBAL VARIABLES
let travelerData;
let tripData;
let destinationData;
let currentTraveler;
let tripRepo;

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

      // Assuming you have a way to select or set the currentTraveler
      currentTraveler = travelerData[0]; // For example, setting the first traveler as the current traveler
      console.log('Current Traveler:', currentTraveler);

      if (currentTraveler) {
        console.log('Displaying traveler dashboard...');
        displayTravelerDashboard();
        tripRepo = createTripRepository(currentTraveler, tripData);
        console.log('Trip Repository:', tripRepo);
        initialize();
      } else {
        console.error('No current traveler found');
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

function initialize() {
  console.log('Initializing application...');
  // Initialization logic here
}

function displayTravelerDashboard() {
  console.log('Displaying traveler dashboard...');
  // Display logic here
}

fetchAllData();
