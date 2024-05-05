import { firebase as db } from "./firebaseInit.js";
import { collection, doc, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', function() {

    const addMealForm = document.getElementById('submit-btn');

    if(addMealForm){
        addMealForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const dateInput = document.getElementById('date').value;
            const dietInput = document.getElementById('diet').value;
            const mealInput = document.getElementById('mealValue').value;
            const colRef = collection(db,'mealOptions');

            // Add a subcollection for each day
            const dateDocRef = doc(colRef, dateInput);
            const dateColRef = collection(dateDocRef, 'meals');
            console.log(dateDocRef);

            await addDoc(dateColRef, {
                diet: dietInput,
                meal: mealInput,
            });
            addMealForm.reset()
        });
    }
});