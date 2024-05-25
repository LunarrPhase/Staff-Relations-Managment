import { auth, onAuthStateChanged } from './firebaseInit.js';
import { DisplaySingleNotification } from './firebase_functions.js';


document.addEventListener("DOMContentLoaded", function() {
    onAuthStateChanged(auth, (user) => {
        
       DisplaySingleNotification(auth);
    });

});