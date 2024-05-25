import { auth, onAuthStateChanged } from './firebaseInit.js';
import { GenerateScreenReport, MakePDF, SendHome } from "./firebase_functions.js";


document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {

        user = auth.currentUser;
        const makePDFButton = document.getElementById('makePdf');
        const generateScreenReport = document.getElementById('screenReport');
        const homebtn = document.getElementById('home');

        makePDFButton.addEventListener('click', async () => {
            MakePDF(user);
        });

        generateScreenReport.addEventListener('click', async () => {
            GenerateScreenReport(user);
        });

        //home button functionality
        homebtn.addEventListener('click', async () => {
            SendHome(user);
        });
    });
});
   

      
  
