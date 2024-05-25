import { auth, onAuthStateChanged } from './firebaseInit.js';
import { SendFeedBack, SendHome } from './firebase_functions.js';

 
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, async (user) => {

        //getting current user
        user = auth.currentUser;
        const feedbackElement = document.getElementById('feedbackButton');
        const form = document.querySelector('form');


        feedbackElement.addEventListener('click', async () => {
            SendHome(user);
        });


        form.addEventListener('submit', async (e) => {
            
            e.preventDefault();
            SendFeedBack(user);
            form.reset();
        });
    });
});
