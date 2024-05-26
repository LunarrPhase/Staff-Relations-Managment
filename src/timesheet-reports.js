import { auth, onAuthStateChanged } from './firebaseInit.js';
import { GenerateTimesheetCSV, GenerateTimesheetPDF, GetTimesheetsByProject, GetTimesheetsByTask, SendHome } from './firebase_functions.js';


//makes sure code loads in time
document.addEventListener("DOMContentLoaded", function() {

    //get current user
    onAuthStateChanged(auth, async (user) => {

        const homebtn = document.getElementById('home');
        const backbtn = document.getElementById('back-btn');
        const projectbtn = document.getElementById('GenerateByProject');
        const taskbtn = document.getElementById('GenerateByTask');
        const GeneratePDFButton = document.getElementById('GeneratePDF');
        const GenerateCSVButton = document.getElementById('GenerateCSV');

        //home button functionality
        homebtn.addEventListener('click', async () => {

            //getting current user
            const user = auth.currentUser;
            SendHome(user);
        })

        //back button to all reports
        backbtn.addEventListener("click", function() {
            // Navigate the user to a new HTML page
            window.location.href = "all-reports.html";
        });

       
        //get the timesheets by project code
        projectbtn.addEventListener("click", function() {
            GetTimesheetsByProject(user);
        });

        taskbtn.addEventListener("click", function() {
            GetTimesheetsByTask(user);
        });


        GeneratePDFButton.addEventListener("click", function() {
            GenerateTimesheetPDF(auth);
        });

        GenerateCSVButton.addEventListener("click", function() {
            GenerateTimesheetCSV(auth);
        });
    });
});
