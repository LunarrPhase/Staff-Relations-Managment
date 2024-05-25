import { auth } from './firebaseInit.js';
import { manageDate } from './functions.js';
import { BookCarWash } from './functions.js';
import { SendHome } from './firebase_functions.js';


document.addEventListener('DOMContentLoaded', function() {
    auth.onAuthStateChanged(user => {

        //this is to make sure only monday and friday are selectable.
        const dateInput = document.getElementById('date');
        manageDate(dateInput);
        BookCarWash(user);

        const goHome = document.getElementById('home');
        goHome.addEventListener('click', async () => {

            //getting current user
            const user = auth.currentUser;
            SendHome(user);
        });
    });
});



