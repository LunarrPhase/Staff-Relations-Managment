import { auth, onAuthStateChanged } from './firebaseInit.js';
import { AddTimeSheet } from './firebase_functions.js';

//wait for the page to load
document.addEventListener("DOMContentLoaded", function() {
    
    //getting the current user
    onAuthStateChanged(auth, async (user) => {
       
        //when you click the submit button it will add the new timesheet data to the db on firestore 
        document.getElementById("timesheetForm").addEventListener("submit", async function(event) {

            //prevent default options when submit
            event.preventDefault(); 
            AddTimeSheet(auth);
        });
    });
});

