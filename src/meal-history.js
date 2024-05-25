import { auth, onAuthStateChanged} from './firebaseInit.js';
import { SendHome, GenerateCSV, GenerateByDate, GenerateByDiet } from "./firebase_functions.js"


//makes sure code loads in time
document.addEventListener("DOMContentLoaded", function() {

    const homebtn = document.getElementById('home');
    const dietbtn = document.getElementById('GenerateByDiet');
    const dateBtn = document.getElementById('GenerateByDate');
    const GeneratePDFButton = document.getElementById('GeneratePDF');
    const GenerateCSVButton = document.getElementById('GenerateCSV');

    //get current user
    onAuthStateChanged(auth, async (user) => {

        //home button functionality
        homebtn.addEventListener('click', async () => {
            const user = auth.currentUser;
            SendHome(user);
        })

        //back button to all reports
        const backbtn = document.getElementById('back-btn');
        backbtn.addEventListener("click", function() {

            // Navigate the user to a new HTML page
            window.location.href = "all-reports.html";
        });

   
        //get the meals by diet
        dietbtn.addEventListener("click", function() {
            GenerateByDiet(auth);
        });
       
        dateBtn.addEventListener("click", async function() {
                GenerateByDate(auth)
        });
    });

    //generate pdf for meal history
    GeneratePDFButton.addEventListener("click", async function() {
        GeneratePDF(auth)
    });

    //generate csv
    GenerateCSVButton.addEventListener("click", async function() {
        GenerateCSV(auth);
    });
});




  

  

  

  

  
