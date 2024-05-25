//need to see all meal bookings made by people on a specifc day
//so if HR wants to see Monday meal bookings, they should be able to choose day and see from that day.
import { displayBookings, displayAllBookings } from "./firebase_functions.js";


document.addEventListener("DOMContentLoaded", (event) => {
    
    document.getElementById('day').addEventListener('change', () => {
        const selectedDate = document.getElementById('day').value;
        displayBookings(selectedDate);
    });
    
    document.getElementById('load-more').addEventListener('click', displayAllBookings);
    
});