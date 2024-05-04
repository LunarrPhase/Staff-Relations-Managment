 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
 import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
 import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
 // TODO: Add SDKs for Firebase products that you w to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
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


const mealInfo = document.getElementById('meal-info');

mealInfo.addEventListener('click', function(event) {
    window.location.href = 'create-meal.html'; 
    console.log('Meal info clicked!');
});

const manageUsers = document.getElementById('manage-users')
manageUsers.addEventListener('click', () => {
  window.location.href = 'manage-users.html'
})
