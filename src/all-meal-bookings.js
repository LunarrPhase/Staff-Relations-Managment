//need to see all meal bookings made by people on a specifc day
//so if HR wants to see Monday meal bookings, they should be able to choose day and see from that day.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

 
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

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)


//access firebase, then document for the day...

// Function to fetch and display bookings based on the selected date
async function displayBookings() {
  const selectedDate = document.getElementById('day').value;
  console.log(selectedDate)
  const usersRef = collection(db, 'users');
  const usersSnapshot = await getDocs(usersRef);

  const usersList = document.getElementById('usersList');
  usersList.innerHTML = ''

  usersSnapshot.forEach(async (userDoc) => {
    const userId = userDoc.id;
    const mealOrdersRef = collection(db, `users/${userId}/mealOrders`);
    const mealOrdersSnapshot = await getDocs(mealOrdersRef)

    mealOrdersSnapshot.forEach((mealOrderDoc) => {
      const mealOrderData = mealOrderDoc.data()
      if (mealOrderData.date === selectedDate) {
        console.log(mealOrderData)
        const row = document.createElement('tr')
        row.innerHTML = `
          <td>${mealOrderData.name}</td>
          <td>${mealOrderData.email}</td>
          <td>${mealOrderData.diet}</td>
          <td>${mealOrderData.date}</td>
        `;
        usersList.appendChild(row);
      }
    });
  });
}

// Add event listener to the day select element
document.getElementById('day').addEventListener('change', displayBookings);

document.getElementById('load-more').addEventListener('click', displayBookings)
