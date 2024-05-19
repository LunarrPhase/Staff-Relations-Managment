import { auth } from './firebaseInit.js';
import { SendHome, populateMeals, doMealBooking } from './firebase_functions.js';
import { areInputsSelected } from './functions.js';


//ensures page waits for all DOMContent to load
document.addEventListener('DOMContentLoaded', function() {

    //ensures that a user who is in the database is logged in
    auth.onAuthStateChanged(user => {
        if (user) {

            //takes user to the appropriate home page
            const goHome = document.getElementById('home');
            goHome.addEventListener('click', async () => {

                //getting current user
                const user = auth.currentUser;
                SendHome(user);
            });

            //gets all necessary form elements
            const submit = document.getElementById('submit-btn');
            const dietSelect = document.getElementById('diet');
            const mealSelect = document.getElementById('meal');
            const dateInput = document.getElementById('date');
            
            // Add event listeners
            dietSelect.addEventListener('change', () => {

                if (areInputsSelected(dateInput, dietSelect)) {
                    populateMeals(dateInput, dietSelect, mealSelect);
                }
            });
            dateInput.addEventListener('change', () => {
                
                if (areInputsSelected(dateInput, dietSelect)) {
                    populateMeals(dateInput, dietSelect, mealSelect);
                }
            });
            
            //submits the meal the user chose when they click submit button
            if (submit) {
                submit.addEventListener('click', async (e) => {
                   
                    e.preventDefault();
                    doMealBooking(dateInput, dietSelect, mealSelect, user);                    
                });
            }
            console.log("User is signed in");
        }
        else {
            // No user is signed in
            console.log("No user is signed in.");
        }
    });
});
