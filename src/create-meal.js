import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, doc,  addDoc} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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
//current date
      const currentDate = new Date();
      const currentDateString = currentDate.toISOString().split('T')[0];
//only creates meals for future dates
      if(dateInput > currentDateString){


      const colRef = collection(db,'mealOptions');

      // Add a subcollection for each day
      const dateDocRef = doc(colRef, dateInput);
      const dateColRef = collection(dateDocRef, 'meals');
      console.log(dateDocRef);

      await addDoc(dateColRef, {
        diet: dietInput,
        meal: mealInput,
      });

      //clears the form and error upon submission and alerts user that meal has been booked

      document.querySelector('.add').reset();  
      alert("Successfully created meal!");
      const warning = document.getElementById("warning");
      warning.innerText= "";

    } else{

      //if the person selects a day that has passed, they get a warning
      const warning = document.getElementById("warning");
      warning.innerText= "Cannot book meals for current and previous days."
    }

    }); 
  }
});
