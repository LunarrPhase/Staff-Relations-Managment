import { getDatabase, ref, get} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";


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
    //console.log("User is signed out");
    loading.style.display = 'none';
  }
});

//i added logout time-might help with timesheets.
const logout = document.getElementById("logout");
const logoutTab = async (e) => {
    e.preventDefault();
    try {
        const dt = new Date();
        await update(ref(database, 'users/' + auth.currentUser.uid), {
            last_logout: dt,
        });
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.log(error.code);
    }
};
logout.addEventListener("click", logoutTab);


const notifications = document.getElementById('notifications');
const popoverContent = document.getElementById('popover-content');

notifications.addEventListener('click', function(event) {
    event.preventDefault(); 
    popoverContent.classList.toggle('show-popover');
});


//const dbRef = firebase.database().ref('users');
//const usersList = document.getElementById('usersList'); // Make sure to define usersList

/*const manageUsersTab = async (e) => {
  e.preventDefault();
  try {
    dbRef.on('value', (snapshot) => {
      usersList.innerHTML = '';
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        const li = document.createElement('li');
        li.textContent = `${user.firstName} - ${user.email}`;
        usersList.appendChild(li);
      });
    });
    window.location.href = 'manage-users.html'
  } catch (error) {
    console.log(error.code);
  }
};*/

const manageUsers = document.getElementById('manage-users');
manageUsers.addEventListener('click', () => {
  // Redirect to manage-users.html
  window.location.href = 'manage-users.html';
});


});


//code for clicking the element with id=feedback-info and being led to a page where you find every employee


var element = document.getElementById("feedback-info");

// Adding an event listener for a click event
element.addEventListener("click", function() {
  window.location.href = "feedback.html";
    console.log("Element clicked!");
});

