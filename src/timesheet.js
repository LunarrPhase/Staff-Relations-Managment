import { database as realtimeDb, auth, firestore as db } from './firebaseInit.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { ChangeWindow, truncateText } from './functions.js';


document.addEventListener("DOMContentLoaded", function() {
    //to get the current user
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

        //code for fetching timesheets for timesheet.html
        if (user) {
            const userId = user.uid;

            if (user.uid) {
                try {
                    //fetch the timesheets from the current users firestore db
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
                        //add it to the html
                          timesheetsBody.innerHTML += timesheetRow;
                          
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
        const button = document.getElementById("add-task");

        
        button.addEventListener("click", function() {

            //Navigate user to a add task html page
            window.location.href = "add-task.html";
        });
    });
});


const goHome = document.getElementById('home');

goHome.addEventListener('click', async () => {

    //getting current user
    const user = auth.currentUser;
   

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
            console.error("Error getting user role:", error)
        }
    }
    else {
        window.location.href = 'index.html'
    }
})




  

  

  

  

  

  