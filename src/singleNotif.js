import { auth, firestore as db } from './firebaseInit.js';
import { collection, getDocs, where, query } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function() {

    
    //function to display a single notification in the bell button popup
    const displaySingleNotification = async () => {
        try {
            //get current user credentials
            const user = auth.currentUser;

            if (!user) {
                console.error("User not authenticated");
                return;
            }

            const userId = user.uid;
            if (!userId) {
                console.error("User ID not available");
                return;
            }
            //get todays date
            const today = new Date();
            const todayString = today.toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format

            // Fetch meal bookings
            const mealOrdersRef = collection(db, `users/${userId}/mealOrders`);
            const mealQuerySnapshot = await getDocs(query(mealOrdersRef, where('date', '==', todayString)));
            const mealBookings = [];
            mealQuerySnapshot.forEach((doc) => {
                mealBookings.push(doc.data());
            });

            // Fetch car wash bookings
            const carWashBookingsRef = collection(db, `users/${userId}/carwashBookings`);
            const carWashQuerySnapshot = await getDocs(query(carWashBookingsRef, where('date', '==', todayString)));
            const carWashBookings = [];
            carWashQuerySnapshot.forEach((doc) => {
                carWashBookings.push(doc.data());
            });

            // Determine the notification text -> it will only display one of these in the popup
            let notificationText = "";
            if (mealBookings.length > 0) {
                const mealBooking = mealBookings[0]; // Get the first meal booking for the day
                notificationText = `Today you booked a ${mealBooking.diet} meal of: ${mealBooking.meal}.`;
            } else if (carWashBookings.length > 0) {
                const carWashBooking = carWashBookings[0]; // Get the first car wash booking for the day
                notificationText = `Today you booked a ${carWashBooking.type} car wash for the ${carWashBooking.slot} slot.`;
            }

            // Update the popover content
            const popoverContent = document.getElementById('popover-content');
            if (notificationText) {
                popoverContent.innerHTML = `
                    <h3>Notifications</h3>
                    <p>${notificationText}</p>
                    <a href="all-notifs.html" class="see-all-link">See all</a>
                `;
            }
        } catch (error) {
            console.error("Error fetching bookings: ", error);
        }
    };

    onAuthStateChanged(auth, (user) => {
        if (user) {
            displaySingleNotification();
        }
    });

});