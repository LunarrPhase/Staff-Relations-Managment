import { database, auth, firestore as db } from "./firebaseInit.js"
import { FirebaseLogin } from "./firebase_functions.js";



auth.signOut().then(() => {
    console.log('User signed out successfully');
    // Optionally, you can do additional actions here if needed
}).catch((error) => {
    console.error('Error signing out: ', error);
});






//listens for the correct login credentials
login.addEventListener('click', async (e) => {
    
    e.preventDefault(); // Prevent the default form submission
    document.getElementById("authenticating").style.display = "block";
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    await FirebaseLogin(auth, database, email, password);
});
