import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js"
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"

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

const app = initializeApp(firebaseConfig)

const database = getDatabase(app)

document.addEventListener('signup', (e) => {
    const { email, firstName, lastName, role } = e.detail;
    set(ref(database, 'users/' + user.uid), {
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: role,
    });
  });

get(ref(database, 'users')).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(data);
    } else {
      console.log('No data available');
    }
  }).catch((error) => {
    console.error('Error reading data:', error);
  });
