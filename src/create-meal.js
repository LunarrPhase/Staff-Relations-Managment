import { CreateMeal } from './firebase_functions.js';


document.addEventListener('DOMContentLoaded', function() {

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
});
