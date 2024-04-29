import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";


document.addEventListener("DOMContentLoaded", function() {
 
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

    onAuthStateChanged(auth, async (user) => {

        //code for timesheets html
        if (user) {
            const userId = user.uid;
            
            if (user.uid) {
                try {

                    const timesheetsRef = collection(db, `users/${userId}/timesheets`);
                    const querySnapshot = await getDocs(timesheetsRef);
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
                }
                catch (error) {
                    console.error("Error fetching timesheets: ", error);
                }
            }
            else {
                console.error("User ID not available");
            }
        }
        else {
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
  
  
  
  
  
  
  
