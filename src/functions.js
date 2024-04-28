import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { ref,  update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";


/* INDEX */


function FirebaseLogin(auth, database, email, password){

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            const dt = new Date();

            update(ref(database, 'users/' + user.uid), {
                last_login: dt,
            });

            // Redirect to the main page.
            window.location.href = 'main-page.html';
        })
        .catch((error) => {

            const errorMessage = SetLoginError(error);
            const errorMessageElement = document.getElementById('error-message');
            errorMessageElement.textContent = errorMessage;
        });
}


function SetLoginError(error){

    let errorMessage;
    //console.log(error.code);

    if (error.code === "auth/invalid-email") {
        errorMessage = "Please provide a valid email address.";
    }
    else if (error.code === "auth/invalid-credential"){
        errorMessage = "Wrong email or password. Please try again."
    }
    else {
        errorMessage = "An error occurred. Please try again later.";
    }

    return errorMessage;
}


/* SIGN UP */


function isValidAccessKey(accessKey) {
    return accessKey === "mR123123" || accessKey === "hR456456" || accessKey === "uR789789";
}


function setRole(accessKey){

    let role;

    if (accessKey === "mR123123") {
       role = "Manager";
    }
    else if (accessKey === "hR456456") {
        role = "HR";
    }
    else if (accessKey === "uR789789"){
        role = "Staff";
    }
    return role;
}


function SetSignUpError(error){


    let errorMessage;

            if (error.code === "auth/email-already-in-use") {
                errorMessage = "The email used to sign up already exists. Please use a different email.";
            }
            else if (error.code === "auth/invalid-email" || document.getElementById('email').value === "") {
                errorMessage = "Please provide a valid email address."
            }
            else if (document.getElementById('password').value === "") {
                errorMessage = "Please create a password."
            }
            else if(error.code=== "auth/invalid-password"){
                errorMessage = "Password must be atleast 6 characters."
            }
            else {
                errorMessage = "An error occurred. Please try again later.";
            }

            const errorMessageElement = document.getElementById('error-message');
            errorMessageElement.textContent = errorMessage;
}


export{FirebaseLogin, SetLoginError, isValidAccessKey, setRole, SetSignUpError};