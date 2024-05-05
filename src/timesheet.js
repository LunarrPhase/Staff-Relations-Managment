import { database as realtimeDb, auth, firestore as db } from './firebaseInit.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { ChangeWindow, truncateText } from './functions.js';


document.addEventListener("DOMContentLoaded", function() {

    onAuthStateChanged(auth, async (user) => {

        const homebtn = document.getElementById('home');
        homebtn.addEventListener('click', async () => {

            //getting current user
            const user = auth.currentUser;
            console.log("clicked!")

            if (user) {
                try {
                    const userRef = ref(realtimeDb, 'users/' + user.uid)
                    get(userRef).then((snapshot) => {

                        const userData = snapshot.val();
                        const role = userData.role;
                        ChangeWindow(role);
                    });
                }
                catch (error) {
                    console.error("Error getting user role:", error);
                }
            }
            else {
                window.location.href = 'index.html'
            }
        });

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
                        const truncatedTaskDescription = truncateText(timesheetData.taskDescription, 20);
                        const timesheetRow = `

                            <tr>
                                <td>${timesheetData.date}</td>
                                <td>${timesheetData.startTime}</td>
                                <td>${timesheetData.endTime}</td>
                                <td>${timesheetData.projectCode}</td>
                                <td>${timesheetData.taskName}</td>
                                <td class="truncate" title="${timesheetData.taskDescription}">${truncatedTaskDescription}</td>
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



  

  

  

  

  

  