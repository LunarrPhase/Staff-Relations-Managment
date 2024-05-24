import { auth } from './firebaseInit.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { GetCurrentUserCarWashBookings, GetCurrentUserMealBookings, SendHome } from './firebase_functions.js';
import { CheckUserAuthenticated, CreateMealNotificationElements, CreateCarWashNotificationElement, PopulateNotifications, CreateFeedbackNotificationElement } from './functions.js';


document.addEventListener("DOMContentLoaded", function() {

    //function to get current user and their id
    onAuthStateChanged(auth, async () => {

        const user = CheckUserAuthenticated(auth);
        
        const homebtn = document.getElementById('home');
        homebtn.addEventListener('click', () => {
            SendHome(user);            
        });

        // Fetch the current user's meal bookings for the current day from the database
        const currentUserMealBookings = await GetCurrentUserMealBookings(user);

        // Create HTML elements dynamically for each meal booking notification
        const mealNotificationElements = CreateMealNotificationElements(currentUserMealBookings);

        // Fetch the current user's car wash bookings for the current day from the database
        const currentUserCarWashBookings = await GetCurrentUserCarWashBookings(user);

        // Create HTML elements dynamically for each car wash booking notification
        const carWashNotificationElements = CreateCarWashNotificationElement(currentUserCarWashBookings);

        const feedbackNotification = await CreateFeedbackNotificationElement(user);

        const feedbackNotificationElements = CreateFeedbackNotificationElement(feedbackNotification);

        const notificationContainer = document.getElementById('NotificationContainer');

        // Combine notification elements for both meal and car wash bookings
        const combinedNotificationElements = [...mealNotificationElements, ...carWashNotificationElements];

        console.log("populate below")
        PopulateNotifications(notificationContainer, combinedNotificationElements);
    });

    //some code to make the notifications heading highligt when the mouse hovers over it
    document.getElementById('heading').addEventListener('mouseover', function() {
        this.classList.add('permanent');
    });
});  