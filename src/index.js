// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
<<<<<<< HEAD
import { getDatabase, ref,  update,get} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth,  signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you w to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
=======
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { FirebaseLogin } from "./functions.js";
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
>>>>>>> 5894fb4896d3b8cd6bb24cb37a178dffbc279934


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


<<<<<<< HEAD

=======
>>>>>>> 5894fb4896d3b8cd6bb24cb37a178dffbc279934
login.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    //document.getElementById('loading-message').style.display = 'block';

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const dt = new Date();

        await update(ref(database, 'users/' + user.uid), {
            last_login: dt,
        });

        const userRef = ref(database, 'users/' + user.uid);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        const role = userData.role || "User"
        console.log(userData)

                if (role === "Manager") {
                    window.location.href = 'manager-main-page.html';
                } else if (role === "HR") {
                    window.location.href = 'admin-main-page.html';
                } else {
                    window.location.href = 'main-page.html';
                }
    } catch (error) {
        let errorMessage;

        if (error.code === "auth/invalid-email") {
            errorMessage = "Please provide a valid email address.";
        } else if (error.code === "auth/wrong-password") {
            errorMessage = "Wrong email or password. Please try again.";
        } else {
            console.log(error)
            errorMessage = "An error occurred. Please try again later.";
        }

        const errorMessageElement = document.getElementById('error-message');
        errorMessageElement.textContent = errorMessage;
    } finally {
        document.getElementById('loading-message').style.display = 'none';
    }
});
