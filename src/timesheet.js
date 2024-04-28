// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
// import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
// //import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// //import { FirebaseLogin } from './functions.js'


// const firebaseConfig = {
//     apiKey: "AIzaSyCdhEnmKpeusKPs3W9sQ5AqpN5D62G5BlI",
//     authDomain: "staff-relations-management.firebaseapp.com",
//     databaseURL: "https://staff-relations-management-default-rtdb.firebaseio.com",
//     projectId: "staff-relations-management",
//     storageBucket: "staff-relations-management.appspot.com",
//     messagingSenderId: "5650617468",
//     appId: "1:5650617468:web:4892625924b0cf6b3ee5f9",
//     measurementId: "G-7J5915RDP9"
// };


// const app = initializeApp(firebaseConfig);
// const realtimDB = getDatabase(app);
// const auth = getAuth();
// const db = getFirestore(app);


// const user = auth.currentUser;
// const userRef = ref(realtimeDb, 'users/' + user.uid)

// //code for timesheets html
// if (user) {
//     const userId = user.uid;
//     if (userId) {
//         try {
//             const timesheetsRef = collection(db, `users/${userId}/timesheets`);
//             const querySnapshot = await getDocs(timesheetsRef);
            
//             querySnapshot.forEach((doc) => {
//                 // Process each timesheet document
//                 const timesheetData = doc.data();
//                     const timesheetRow = `
//                     <tr>
//                         <td>${timesheetData.date}</td>
//                         <td>${timesheetData.startTime}</td>
//                         <td>${timesheetData.endTime}</td>
//                         <td>${timesheetData.projectCode}</td>
//                         <td>${timesheetData.taskDescription}</td>
//                         <td>${timesheetData.totalHours}</td>
//                     </tr>
//                     `;

//                     timesheetsBody.innerHTML += timesheetRow;
//                 console.log(doc.id, " => ", doc.data());
//             });

//             console.log("Timesheets retrieved successfully");
//         } catch (error) {
//             console.error("Error fetching timesheets: ", error);
//         }
//     } else {
//         console.error("User ID not available");
//     }
// } else {
//     console.error("User not authenticated");
// }













// //code to go to the add task

//     //Get the button element by its ID
//     const button = document.getElementById("add-task");

//     //event listener to the button
//     button.addEventListener("click", function() {
//         // Navigate the user to a new HTML page
//         window.location.href = "add-task.html";
//     });

//     document.getElementById("timesheetForm").addEventListener("submit", async function(event) {
//       event.preventDefault(); 
  
//       //Get input 
//       var fullName = document.getElementById("fullName").value;
//       var email = document.getElementById("email").value;
//       var date = document.getElementById("date").value;
//       var startTime = document.getElementById("startTime").value;
//       var endTime = document.getElementById("endTime").value;
//       var totalHours = document.getElementById("totalHours").value;
//       var projectCode = document.getElementById("projectCode").value;
//       var taskDescription = document.getElementById("taskDescription").value;
  
//       //Get current user ID 
//       //current user is in the realtime database u need to do something like this, this is how i get the currently logged in user in main.js
//     //import onAuthStateChanged where getAuth is if you use it
        
// // onAuthStateChanged(auth, async (user) => {
// //   if (user) {
// //     try {
// //       //console.log("User ID:", user.uid);
// //       const userRef = ref(realtimDB, 'users/' + user.uid);
// //       const snapshot = await get(userRef);
// //       const userData = snapshot.val();
// //       //console.log(userData);
// //     //   const firstName = userData.firstName || "Unknown";
// //     //   const role = userData.role || "User";
// //       loading.style.display = 'none'
// //     } catch (error) {
// //       console.error("Error fetching user data:", error)
// //       loading.style.display = 'none'
// //     }
// //   } else {
// //     //console.log("User is signed out")
// //     loading.style.display = 'none'
// //   }
// // });
       
//     //   this syntax is outdated and also gets from the firestore not from realtime database.
//     //   var currentUser = firebase.auth().currentUser;
//     //   var userId = currentUser ? currentUser.uid : null;
  
//       //Store data in Firestore
//       try {
//         const user = auth.currentUser;
//         if (user) {
//             const userId = user.uid;
//             if (userId) {
//                 //Adding the timesheet to the user's timesheets subcollection with auto-generated ID
//                 const timesheetsRef = collection(db, `users/${userId}/timesheets`);
//                 await addDoc(timesheetsRef, {
//                     fullName: fullName,
//                     email: email,
//                     date: date,
//                     startTime: startTime,
//                     endTime: endTime,
//                     projectCode: projectCode,
//                     taskDescription: taskDescription,
//                     totalHours: totalHours
//                 });
//                 console.log("Timesheet added successfully");
//                 window.location.href = "timesheet.html";
//             } else {
//                 console.error("User ID not available");
//             }
//         } else {
//             console.error("User not authenticated");
//         }
//     } catch (error) {
//         console.error("Error adding timesheet: ", error);
//     }
//   });