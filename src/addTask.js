import { database as realtimeDb, auth, firestore as db } from './firebaseInit.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

//wait for the page to load
document.addEventListener("DOMContentLoaded", function() {
    //getting the current user
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const userRef = ref(realtimeDb, 'users/' + user.uid);
                const snapshot = await get(userRef);
            }
            catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        else {
            console.log("User is signed out");
        }

        //when you click the submit button it will add the new timesheet data to the db on firestore 
        document.getElementById("timesheetForm").addEventListener("submit", async function(event) {
            //prevent default options when submit
            event.preventDefault(); 
            
            //Get input from the form
            var fullName = document.getElementById("fullName").value;
            var email = document.getElementById("email").value;
            var date = document.getElementById("date").value;
            var startTime = document.getElementById("startTime").value;
            var endTime = document.getElementById("endTime").value;
            var totalHours = document.getElementById("totalHours").value;
            
            if (totalHours.length > 4) { // Limit total time to  4 characters just incase a user goes crazy
        		totalHours = totalHours.substring(0, 4);
    		}

            var projectCode = document.getElementById("projectCode").value;
            var taskName = document.getElementById("taskName").value;
            var taskDescription = document.getElementById("taskDescription").value;
            //adds the data collected to the users timesheets in firestore
            try {
                
                const user = auth.currentUser;
                if (user) {
                    const userId = user.uid;
                    if (userId) {
                        //Adding the timesheet to the user's timesheets subcollection with auto-generated ID
                        const timesheetsRef = collection(db, `users/${userId}/timesheets`);
                       //structure the json
                        await addDoc(timesheetsRef, {
                            fullName: fullName,
                            email: email,
                            date: date,
                            startTime: startTime,
                            endTime: endTime,
                            projectCode: projectCode,
                            taskName: taskName,
                            taskDescription: taskDescription,
                            totalHours: totalHours
                        });

                        console.log("Timesheet added successfully");
                        //takes user back to the timesheet page.
                        window.location.href = "timesheet.html";
                    }
                    else {
                        console.error("User ID not available");
                    }
                }
                else {
                    console.error("User not authenticated");
                }
            }
            catch (error) {
                console.error("Error adding timesheet: ", error);
            }
        });
    });
});

