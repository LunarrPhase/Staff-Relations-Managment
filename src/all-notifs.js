import { database as realtimeDb, auth, firestore as db } from './firebaseInit.js';

import { collection, getDocs, where, query } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import { ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

import { ChangeWindow, truncateText } from './functions.js';



document.addEventListener("DOMContentLoaded", function() {



    onAuthStateChanged(auth, async (user) => {



        const homebtn = document.getElementById('home');

        homebtn.addEventListener('click', async () => {



            //getting current user

            const user = auth.currentUser;

            console.log("clicked!")



            if (user) {

                try {

                    const userRef = ref(realtimeDb, 'users/' + user.uid)

                    get(userRef).then((snapshot) => {



                        const userData = snapshot.val();

                        const role = userData.role;

                        ChangeWindow(role);

                    });

                }

                catch (error) {

                    console.error("Error getting user role:", error);

                }

            }

            else {

                window.location.href = 'index.html'

            }

        });







        // Fetch the current user's meal bookings for the current day from the database

const getCurrentUserMealBookings = async () => {

    try {

        const user = auth.currentUser;

        if (!user) {

            console.error("User not authenticated");

            return [];

        }



        const userId = user.uid;

        if (!userId) {

            console.error("User ID not available");

            return [];

        }



        const today = new Date();

        const todayString = today.toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format

	

        const mealOrdersRef = collection(db, `users/${userId}/mealOrders`);
        

	const querySnapshot = await getDocs(query(mealOrdersRef, where('date', '==', todayString)));

        const mealBookings = [];

        querySnapshot.forEach((doc) => {

            mealBookings.push(doc.data());

        });



        return mealBookings;

    } catch (error) {

        console.error("Error fetching meal bookings: ", error);

        return [];

    }

};



// Create HTML elements dynamically for each notification

const createNotificationElements = (mealBookings) => {

    const notificationElements = mealBookings.map((mealBooking) => {

        const notificationElement = document.createElement('div');

        notificationElement.classList.add('notification');



        const mealText = `Today you booked a ${mealBooking.diet} meal of: ${mealBooking.meal}.`;

        notificationElement.innerText = mealText;



        return notificationElement;

    });



    return notificationElements;

};





//fetch car wash bookings for today


// Fetch the current user's car wash bookings for the current day from the database
const getCurrentUserCarWashBookings = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            return [];
        }

        const userId = user.uid;
        if (!userId) {
            console.error("User ID not available");
            return [];
        }

        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format

        const carWashBookingsRef = collection(db, `users/${userId}/carwashBookings`);
        const querySnapshot = await getDocs(query(carWashBookingsRef, where('date', '==', todayString)));

        const carWashBookings = [];
        querySnapshot.forEach((doc) => {
            carWashBookings.push(doc.data());
        });

        return carWashBookings;
    } catch (error) {
        console.error("Error fetching car wash bookings: ", error);
        return [];
    }
};

// Create HTML elements dynamically for each car wash booking notification
const createCarWashNotificationElements = (carWashBookings) => {
    const notificationElements = carWashBookings.map((carWashBooking) => {
        const notificationElement = document.createElement('div');
        notificationElement.classList.add('notification');

        const notificationText = `Today you booked a ${carWashBooking.type} car wash for today's ${carWashBooking.slot} slot.`;
        notificationElement.innerText = notificationText;

        return notificationElement;
    });

    return notificationElements;
};


















// Populate the NotificationContainer section with notification elements

const populateNotifications = async () => {

    const mealBookings = await getCurrentUserMealBookings();
    const carWashBookings = await getCurrentUserCarWashBookings();

    const notificationContainer = document.getElementById('NotificationContainer');

    const mealnotificationElements = createNotificationElements(mealBookings);
    const carWashNotificationElements = createCarWashNotificationElements(carWashBookings);


   // Combine notification elements for both meal and car wash bookings
   const combinedNotificationElements = [...mealnotificationElements, ...carWashNotificationElements];

   combinedNotificationElements.forEach((element) => {
       notificationContainer.appendChild(element);
   });
};



// Call the populateNotifications function when the page loads



    populateNotifications();












      

    });

});








  

  

  

  

  