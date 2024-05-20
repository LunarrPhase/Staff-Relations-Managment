import { auth } from './firebaseInit.js';
import { manageDate, areInputsSelected } from './functions.js';
import { SendHome, doBooking } from './firebase_functions.js';


document.addEventListener('DOMContentLoaded', function() {
    auth.onAuthStateChanged(user => {

        //this is to make sure only monday and friday are selectable.
        const dateInput = document.getElementById('date');
        manageDate(dateInput);

        if (user) {
            const submit = document.getElementById('submit-btn');
            const typeCarwash = document.getElementById('carWashType');
            const timeSlot = document.getElementById('timeSlot');
            const day = document.getElementById('date');
        
          
            if (submit) {
                submit.addEventListener('click', async (e) => {
                    e.preventDefault();

                    if (areInputsSelected(day, typeCarwash)) {
                        doBooking(typeCarwash, timeSlot, day, user);
                    } 
                    else {
                        alert("Please select both date and time slot.");
                    }
                });
            }
            console.log("User is signed in");
        }
        else {
            console.log("No user is signed in.");
        }

        const goHome = document.getElementById('home');
        goHome.addEventListener('click', async () => {

            //getting current user
            const user = auth.currentUser;
            SendHome(user);
        });
    });
});



