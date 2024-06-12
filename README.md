### Abstract:
This is a trip booking application that a user can use to book trips, check on the status of upcoming trips, see the past trips made, and get estimates for trips depending on number of travels, flight cost, and duration of stay.

### Installation Instructions:
FOR TESTING:
1. Fork and clone this repo into your local machine.
2. Navigate to the folder and run npm install in your terminal for dependencies. 
3. Run tests with 'npm test' in your terminal
TO RUN THE APPLICATION
1. Complete steps 1 and 2 above to ensure this repo is within your local machine
2. Clone(no need to fork) down this local server https://github.com/turingschool-examples/travel-tracker-api
3. Navigate into it and run npm install for dependencies 
4. Run npm start in both the Travel-Tracker and travel-tracker-api to start the application and be connected to the local server

### Preview of App:
![TRAVEL-TRACKER](https://github.com/baileyjarvis2814/Travel-Tracker/assets/148404225/78c8ac32-2bd7-478a-9319-73e7394deb9a)

### Context:
This Turing Mod 2 project was assigned 2024/06/04 and due by 9PM MT 2024/06/11. 

### Contributors:
Jarvis Bailey - https://github.com/baileyjarvis2814

### Learning Goals:
Use object and array prototype methods to perform data manipulation
Create a clear and accessible user interface
Make network requests to retrieve data
Implement a robust testing suite using TDD
Write DRY, reusable code that follows SRP (Single Responsibility Principle)

### Wins + Challenges:
- Challenge: Maintaining dry code solo was quite a challenge. Functions like bookNewTrip and handleLogin are longer than I would like them to be.
- Win: The CSS stylings came out to a degree I was happy with. This is due in part to my partner from the previous group project Adam Konber and his experience/coaching with CSS.
- Challenge: Testing for edge cases is a much more thorough process as projects grow. I found myself having to add alerts and timeouts for situations like booking a trip in the past, booking 2 trips on the same date, etc.
- Win: Overall I'm happy with the dynamic fetch/post data functions I have. I would like to implement a delete function in the future as well for trips that are no longer desired or already completed to save up on local storage space.
