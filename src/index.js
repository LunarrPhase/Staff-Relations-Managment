import { auth } from "./firebaseInit.js"
import { EnsureSignOut, FirebaseLogin } from "./firebase_functions.js";


EnsureSignOut(auth);


//listens for the correct login credentials
login.addEventListener('click', async (e) => {
    
    e.preventDefault(); // Prevent the default form submission
    document.getElementById("authenticating").style.display = "block";
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    await FirebaseLogin(auth, email, password);
});
