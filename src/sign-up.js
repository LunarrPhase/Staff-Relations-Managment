import { database, auth } from "./firebaseInit.js";
import { set, ref } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { isValidAccessKey, SetRole, SetSignUpError } from "./functions.js";
// TODO: Add SDKs for Firebase products that you w to use
// https://firebase.google.com/docs/web/setup#available-libraries


signUp.addEventListener('click', (e) =>{

    e.preventDefault();
    
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let accessKey = document.getElementById('accessKey').value;
    let role;

    if(document.getElementById('firstName').value.trim() === "" || document.getElementById('lastName').value.trim() === "" ){
        document.getElementById('error-message').textContent = "Enter a valid first and last name."
        return
    }

    if (accessKey && isValidAccessKey(accessKey)) {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

            const user = userCredential.user;
            role = SetRole(accessKey);

            set(ref(database, 'users/' + user.uid), {
                email: email,
                firstName: firstName,
                lastName: lastName,
                role: role,
            });

            document.getElementById("info").textContent = "Your account was successfully created. Go back to the sign in page and sign in.";
            window.location.href = 'index.html'
        })
        .catch((error) => {
            console.log(error.code);
            const errorMessage = SetSignUpError(error, email, password);
            const errorMessageElement = document.getElementById('error-message');
            errorMessageElement.textContent = errorMessage;
        });
    }   
    else {
        document.getElementById('error-message').textContent = "Invalid access key.";
    }
});

