// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, set, ref,  update, get} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you w to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
document.addEventListener('DOMContentLoaded', (event) => {
  const loading = document.getElementById('loading');
  loading.style.display = 'block'; // Show loading animation
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
const database = getDatabase(app);
const auth = getAuth();



//get the currently signed in user
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      //console.log("User ID:", user.uid); // Log the user ID
      const userRef = ref(database, 'users/' + user.uid);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      //console.log(userData);
      const firstName = userData.firstName || "Unknown";
      const role = userData.role || "User";
      if (role === "Manager") {
        document.getElementById('userInfo').textContent = `Hello, Manager ${firstName}`;
      } else if (role === "HR") {
        document.getElementById('userInfo').textContent = `Hello, HR ${firstName}`;
      } else {
        document.getElementById('userInfo').textContent = `Hello, User ${firstName}`;
      }
      
      loading.style.display = 'none';
    } catch (error) {
      console.error("Error fetching user data:", error);
      loading.style.display = 'none';
    }
  } else {
    console.log("User is signed out");
    loading.style.display = 'none';
  }
});

//on-click of login.
const logout = document.getElementById("logout");
const logoutTab = async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    console.log("User Signed Out Successfully!");
    window.location.href = 'index.html';
  } catch (error) {
    console.log(error.code);
  }
};
logout.addEventListener("click", logoutTab);

});