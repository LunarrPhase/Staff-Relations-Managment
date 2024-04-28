import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
//import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc , getDocs, doc} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
//import { FirebaseLogin } from './functions.js'
import {  ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", function() {
  // Your JavaScript code here

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
const realtimDB = getDatabase(app);
const auth = getAuth();
const db = getFirestore(app);
const realtimeDb = getDatabase(app);

const user = auth.currentUser;



onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        //console.log("User ID:", user.uid); // Log the user ID
        const userRef = ref(realtimeDb, 'users/' + user.uid);
        //console.log(user.uid);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        //console.log(userData);

        
      } catch (error) {
        console.error("Error fetching user data:", error);
        
      }
    } else {
      console.log("User is signed out");
      
    }
  


//code for timesheets html
if (user) {
    const userId = user.uid;
    if (user.uid) {
        try {
            const timesheetsRef = collection(db, `users/${userId}/timesheets`);
            const querySnapshot = await getDocs(timesheetsRef);
            
            //const colRef = collection(db, 'users');
            //const userDocRef = doc(colRef, userId);
            //const timesheetsRef = collection(userDocRef, 'timesheets');
            //const querySnapshot = await getDocs(timesheetsRef);
            const timesheetsBody = document.getElementById("timeSheetBody");
            
            querySnapshot.forEach((doc) => {
                // Process each timesheet document
                const timesheetData = doc.data();
                    const timesheetRow = `
                    <tr>
                        <td>${timesheetData.date}</td>
                        <td>${timesheetData.startTime}</td>
                        <td>${timesheetData.endTime}</td>
                        <td>${timesheetData.projectCode}</td>
                        <td>${timesheetData.taskDescription}</td>
                        <td>${timesheetData.totalHours}</td>
                    </tr>
                    `;

                    timesheetsBody.innerHTML += timesheetRow;
                //console.log(doc.id, " => ", doc.data());
            });

            console.log("Timesheets retrieved successfully");
        } catch (error) {
            console.error("Error fetching timesheets: ", error);
        }
    } else {
        console.error("User ID not available");
    }
} else {
    console.error("User not authenticated");
}







//code to go to the add task

    //Get the button element by its ID
    const button = document.getElementById("add-task");

    //event listener to the button
    button.addEventListener("click", function() {
        // Navigate the user to a new HTML page
        window.location.href = "add-task.html";
    });

    
  
  
  
  });
  });
  
  
  
  
  
  
  
