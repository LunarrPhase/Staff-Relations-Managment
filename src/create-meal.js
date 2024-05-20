import { CreateMeal, SendHome } from './firebase_functions.js';
import { auth } from './firebaseInit.js';


document.addEventListener('DOMContentLoaded', function() {

     //ensures that a user who is in the database is logged in
    auth.onAuthStateChanged(user => {
        if (user) {

    

            const goHome = document.getElementById('home');
        

            goHome.addEventListener('click', async () => {
                SendHome(user);
            })

    //the submit button for the form
    const addMealForm = document.getElementById('submit-btn');

    //meal form is filled and submit is clicked
    if(addMealForm){
        addMealForm.addEventListener('click', async (e) => {
            e.preventDefault();

            //form elements
            const dateInput = document.getElementById('date').value;
            const dietInput = document.getElementById('diet').value;
            const mealInput = document.getElementById('mealValue').value;

            CreateMeal(dateInput, dietInput, mealInput);
        }); 
    }

}
else {
    // No user is signed in
    console.log("No user is signed in.");
}
    });
});
