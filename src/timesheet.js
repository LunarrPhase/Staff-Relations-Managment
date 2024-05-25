import { auth, onAuthStateChanged } from './firebaseInit.js';
import { FetchTimesheets, SendHome } from './firebase_functions.js';


document.addEventListener("DOMContentLoaded", function() {
    
    //to get the current user
    onAuthStateChanged(auth, async (user) => {

        const homebtn = document.getElementById('home');
        const button = document.getElementById("add-task");

        homebtn.addEventListener('click', async () => {

            //getting current user
            const user = auth.currentUser;
            await SendHome(user);
        });

        //code for fetching timesheets for timesheet.html
        await FetchTimesheets(user);
        
        //code to go to the add task
        button.addEventListener("click", function() {

            //Navigate user to a add task html page
            window.location.href = "add-task.html";
        });
    });
});




  

  

  

  

  

  