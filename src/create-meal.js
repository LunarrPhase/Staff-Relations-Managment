import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc , addDoc} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCdhEnmKpeusKPs3W9sQ5AqpN5D62G5BlI",
    authDomain: "staff-relations-management.firebaseapp.com",
    databaseURL: "https://staff-relations-management-default-rtdb.firebaseio.com",
    projectId: "staff-relations-management",
    storageBucket: "staff-relations-management.appspot.com",
    messagingSenderId: "5650617468",
    appId: "1:5650617468:web:4892625924b0cf6b3ee5f9",
    measurementId: "G-7J5915RDP9"
  };

  // Initialize Firebase
  initializeApp(firebaseConfig);

  // Get a Firestore instance
  const db = getFirestore();

  const addMealForm = document.getElementById('submit-btn');

  if(addMealForm){
    addMealForm.addEventListener('click', async (e) => {
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

      document.querySelector('.add').reset();

    }); 
  }
});
