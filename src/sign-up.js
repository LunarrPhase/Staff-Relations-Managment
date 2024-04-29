// Import the functions you need from the SDKs you need
//import { app } from "./initialise-firebase.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { isValidAccessKey, SetRole, SetSignUpError } from "./functions.js";
// TODO: Add SDKs for Firebase products that you w to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCdhEnmKpeusKPs3W9sQ5AqpN5D62G5BlI",
    authDomain: "staff-relations-management.firebaseapp.com",
    databaseURL: "https://staff-relations-management-default-rtdb.firebaseio.com",
    projectId: "staff-relations-management",
    storageBucket: "staff-relations-management.appspot.com",
    messagingSenderId: "5650617468",
    appId: "1:5650617468:web:4892625924b0cf6b3ee5f9",
    measurementId: "G-7J5915RDP9"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const database = getDatabase(app);
const auth = getAuth();


signUp.addEventListener('click', (e) =>{

    e.preventDefault();
    
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let accessKey = document.getElementById('accessKey').value;

    if(document.getElementById('firstName').value.trim() === "" || document.getElementById('lastName').value.trim() === "" ){
        document.getElementById('error-message').textContent = "Enter a valid first and last name."
        return
    }

    if (accessKey && isValidAccessKey(accessKey)) {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

            const user = userCredential.user;
            role = SetRole(accessKey);

      // Update user profile with role
      /* user.updateProfile({
        displayName: role,
      });*/


        set(ref(database, 'users/' + user.uid), {
            email: email,
            firstName: firstName,
            lastName: lastName,
            role: role,
        });
      
      //console.log(firstName)
      //console.log(role)

        document.getElementById("info").textContent = "Your account was successfully created. Go back to the sign in page and sign in.";
        window.location.href = 'index.html'
    })
    .catch((error) => {
            SetSignUpError(error, email, password);
            const errorMessageElement = document.getElementById('error-message');
            errorMessageElement.textContent = errorMessage;
        });
    }   
    else {
        document.getElementById('error-message').textContent = "Invalid access key.";
    }
});
