import firebase from "firebase/app";
//import { signInWithEmailAndPassword } from "firebase-auth";
//const firebase = require('firebase');
//import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
const App = {
  authenticate: async (email, password) => {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  },
};

export default App;


function FirebaseLogin(email, password, auth, database){

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
        let errorMessage;
        console.log(error.code);

        if (error.code === "auth/invalid-email") {
            errorMessage = "Please provide a valid email address.";
        }else if(error.code === "auth/invalid-credential"){
            errorMessage = "Wrong email or password. Please try again."
        }else {
            errorMessage = "An error occurred. Please try again later.";
        }

        const errorMessageElement = document.getElementById('error-message');
        errorMessageElement.textContent = errorMessage;
    });
}
//export{FirebaseLogin};