import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, where, getDocs, query,  doc, setDoc, addDoc, getDoc  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
  // Firebase configuration
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
  const app = initializeApp(firebaseConfig);

  // Get a Firestore instance
  const db = getFirestore(app);

  const submit = document.getElementById('submit-btn');
  const dietSelect = document.getElementById('diet');
  const mealSelect = document.getElementById('meal');
  const dateInput = document.getElementById('date');

  // Function to check if both date and diet are selected
  function areInputsSelected() {
    return dateInput.value !== "" && dietSelect.value !== "";
  }

  // Populate meals dropdown based on selected date and diet
  // Populate meals dropdown based on selected date and diet
  async function populateMeals() {
    if (areInputsSelected()) {
      const selectedDate = dateInput.value;
      const selectedDiet = dietSelect.value;
      const mealOptionsRef = doc(collection(db, 'mealOptions'), selectedDate);
  
      const mealOptionsSnapshot = await getDoc(mealOptionsRef);
      //console.log(mealOptionsSnapshot);
  
      if (mealOptionsSnapshot.exists()) {
        const mealsCollectionRef = collection(mealOptionsRef, 'meals');
        const mealsQuery = query(mealsCollectionRef, where('diet', '==', selectedDiet));
        const mealsSnapshot = await getDocs(mealsQuery);
        console.log(mealsSnapshot);
  
        mealSelect.innerHTML = '';
  
        mealsSnapshot.forEach((mealDoc) => {
          const mealData = mealDoc.data();
          console.log(mealData);
          const option = document.createElement('option');
          option.text = mealData.meal;
          option.value = mealData.meal;
          mealSelect.add(option);
        });
      }
    }
  }
  
  
  
  // Add event listeners
  dietSelect.addEventListener('change', populateMeals);
  dateInput.addEventListener('change', populateMeals);

  // Form submission
  if(submit){
    submit.addEventListener('click', async (e) => {
      e.preventDefault();
      if (areInputsSelected()) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const selectedDate = dateInput.value;
        const selectedDiet = dietSelect.value;
        const selectedMeal = mealSelect.value;

        // Here you can perform the submission logic, like adding the booking to Firestore.
        // Example:
        const mealBookingsRef = collection(db, 'mealBookings');
        await addDoc(mealBookingsRef, {
          name: name,
          email: email,
          date: selectedDate,
          diet: selectedDiet,
          meal: selectedMeal
        });

        // Clear form inputs after submission
        form.reset();
      } else {
        console.log("Please select both date and diet.");
      }
    });
  }
});
