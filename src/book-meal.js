import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, where, getDocs, query,  doc , addDoc} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
  const auth = getAuth();

  // Get a Firestore instance
 const db = getFirestore(app);

  auth.onAuthStateChanged(user => {
    if (user) {


          const submit = document.getElementById('submit-btn');
  const dietSelect = document.getElementById('diet');
  const mealSelect = document.getElementById('meal');
  const dateInput = document.getElementById('date');

  // Function to check if both date and diet are selected
  function areInputsSelected() {
    return dateInput.value !== "" && dietSelect.value !== "";
  }

  // Populate meals dropdown based on selected date and diet
  async function populateMeals() {
    if (areInputsSelected()) {
      const selectedDate = dateInput.value;
      const selectedDiet = dietSelect.value;
      const mealOptionsRef = doc(db, 'mealOptions', selectedDate);
  
      const mealOptionsSnapshot = await getDocs(collection(mealOptionsRef, 'meals'));
      console.log(mealOptionsSnapshot);
  
      mealSelect.innerHTML = '';
  
      mealOptionsSnapshot.forEach((mealDoc) => {
        const mealData = mealDoc.data();
        if (mealData.diet === selectedDiet) {
          const option = document.createElement('option');
          option.text = mealData.meal;
          option.value = mealData.meal;
          mealSelect.add(option);
        }
      });
    }
  }
  
  // Add event listeners
  dietSelect.addEventListener('change', populateMeals);
  dateInput.addEventListener('change', populateMeals);

  
if (submit) {
  submit.addEventListener('click', async (e) => {
    e.preventDefault();
    if (areInputsSelected()) {
      const name = document.getElementById('name').value;
      
      const selectedDate = dateInput.value;
      const selectedDiet = dietSelect.value;
      const selectedMeal = mealSelect.value;

     

      const userId = user.uid;
      console.log(userId);
      const userMealOrdersRef = collection(db, `users/${userId}/mealOrders`);
      const userEmail = user.email;

      await addDoc(userMealOrdersRef, {
        name: name,
        email: userEmail,
        date: selectedDate,
        diet: selectedDiet,
        meal: selectedMeal
      });

      
      const mealOrdersCollectionRef = collection(db, 'mealOrders');
      await addDoc(mealOrdersCollectionRef, {
        name: name,
        email: userEmail,
        date: selectedDate,
        diet: selectedDiet,
        meal: selectedMeal
      });

      
      document.querySelector('.mealForm').reset();
    } else {
      console.log("Please select both date and diet.");
    }
  });
}

      
      console.log("User is signed in:", user.uid);
    }

    else {
        // No user is signed in
        console.log("No user is signed in.");
      }
});




});
