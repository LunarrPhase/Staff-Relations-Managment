import { database, auth } from "./firebaseInit.js"
import { FirebaseLogin } from "./functions.js";


login.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent the default form submission
    document.getElementById("authenticating").style.display = "block";
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    FirebaseLogin(auth, database, email, password);
});
