import { GetCarwashBookings } from './firebase_functions.js';
import { manageDate, getDayName, renderBookings } from './functions.js';


document.addEventListener("DOMContentLoaded", function(){

    const usersList = document.getElementById('usersList');
    const dateInput = document.getElementById('date');
    manageDate(dateInput);
    getDayName();

    document.getElementById('date').addEventListener('change', async () => {
    
        const selectedDate = document.getElementById('date').value;
        document.getElementById("loading").style.display = "block";
        const bookings = await GetCarwashBookings(selectedDate);
    
        renderBookings(bookings, usersList);
        document.getElementById("loading").style.display = "none";
    });
});