import { database, auth, firestore as db } from "./firebaseInit.js"
import { FirebaseLogin } from "./functions.js";


login.addEventListener('click', async (e) => {
    
    e.preventDefault(); // Prevent the default form submission
    document.getElementById("authenticating").style.display = "block";
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    await FirebaseLogin(auth, database, db, email, password);
});
