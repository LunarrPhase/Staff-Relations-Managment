import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

  const form = document.querySelector('.mealForm');
  const dietSelect = document.getElementById('diet');
  const mealSelect = document.getElementById('meal');
  const dateInput = document.getElementById('date');

  // Populate meals dropdown based on selected date and diet
  dietSelect.addEventListener('change', async () => {
    await populateMeals();
  });

  dateInput.addEventListener('change', async () => {
    await populateMeals();
  });

  async function populateMeals() {
    const selectedDate = dateInput.value;
    const selectedDiet = dietSelect.value;
  
    if (selectedDate && selectedDiet) {
      const mealOptionsRef = doc(collection(db, 'mealOptions'), selectedDate);
      const mealOptionsSnapshot = await getDoc(mealOptionsRef);
  
      if (mealOptionsSnapshot.exists()) {
        const mealsCollectionRef = collection(mealOptionsRef, 'meals');
        const mealsSnapshot = await getDocs(mealsCollectionRef);
  
        // Clear previous options
        mealSelect.innerHTML = '';
  
        mealsSnapshot.forEach((mealDoc) => {
          const mealData = mealDoc.data();
          if (mealData.diet === selectedDiet) {
            const option = document.createElement('option');
            option.text = mealData.meal;
            option.value = mealData.meal;
            mealSelect.add(option);
          }
        });
      } else {
        console.log("No meal options found for the selected date.");
      }
    }
  }
  

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const selectedDate = dateInput.value;
    const selectedDiet = dietSelect.value;
    const selectedMeal = mealSelect.value;

    // Here you can perform the submission logic, like adding the booking to Firestore.
    // Example:
    const mealBookingsRef = collection(db, 'mealBookings');
    await addDoc(mealBookingsRef, { // Corrected variable name here
      name: name,
      email: email,
      date: selectedDate,
      diet: selectedDiet,
      meal: selectedMeal
    });

    // Clear form inputs after submission
    form.reset();
  });

});
