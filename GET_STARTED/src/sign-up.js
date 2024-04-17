 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
 import { getDatabase, set, ref,  update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
 import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
 // TODO: Add SDKs for Firebase products that you w to use
 // https://firebase.google.com/docs/web/setup#available-libraries

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
      let role;
      if (accessKey === "mR123123") {
        role = "Manager";
      } else if (accessKey === "hR456456") {
        role = "HR";
      } else if (accessKey === "uR789789"){
        role = "Staff";
      }

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
      let errorMessage;
      console.log(errorMessage)
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "The email used to sign up already exists. Please use a different email.";
      } else if (error.code === "auth/invalid-email" || document.getElementById('email').value === "") {
        errorMessage = "Please provide a valid email address."
      } else if (document.getElementById('password').value === "") {
        errorMessage = "Please create a password."
      }else if(error.code=== "auth/invalid-password"){
        errorMessage = "Password must be atleast 6 characters."
      } else {
        errorMessage = "An error occurred. Please try again later.";
      }

      const errorMessageElement = document.getElementById('error-message');
      errorMessageElement.textContent = errorMessage;
    });
} else {
  document.getElementById('error-message').textContent = "Invalid access key.";
}
});
 

function isValidAccessKey(accessKey) {
return accessKey === "mR123123" || accessKey === "hR456456" || accessKey === "uR789789";
}
