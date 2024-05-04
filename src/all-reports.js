import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

 
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

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const realtimeDb = getDatabase(app);

const goHome = document.getElementById('home');

goHome.addEventListener('click', async () => {
  //getting current user
  const user = auth.currentUser;
  console.log("clicked!")

  if (user) {
    try {
      
      const userRef = ref(realtimeDb, 'users/' + user.uid)

      get(userRef).then((snapshot) => {
        const userData = snapshot.val();
        const role = userData.role;
        if (role === "Manager") {
          window.location.href = 'manager-main-page.html'
        } else if (role === "HR") {
          window.location.href = 'admin-main-page.html'
        } else {
          window.location.href = 'main-page.html'
        }
      });
    } catch (error) {
      console.error("Error getting user role:", error)
    }
  } else {
    window.location.href = 'index.html'
  }
})

