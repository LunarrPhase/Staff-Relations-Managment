import { auth, onAuthStateChanged } from './firebaseInit.js';
import { SendHome } from './firebase_functions.js';


document.addEventListener("DOMContentLoaded", function() {
    onAuthStateChanged(auth, async (user) => {

        //getting current user
        const user = CheckUserAuthenticated(auth);

        //code to send the user to the right home page for the back and home button
        const goHome = document.getElementById('home');
        const backButton = document.getElementById('back-btn');

        goHome.addEventListener('click', async () => {
            SendHome(user);
        })


        backButton.addEventListener('click', async () => {
            SendHome(user);
        });
    });
});
