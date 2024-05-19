import { database, auth, firestore as db } from "./firebaseInit.js";
import { collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { set, ref } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { isValidAccessKey, SetRole, SetSignUpError } from "./functions.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

document.getElementById('signUp').addEventListener('click', (e) => {
    e.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let accessKey = document.getElementById('accessKey').value;

    if (firstName.trim() === "" || lastName.trim() === "") {
        document.getElementById('error-message').textContent = "Enter a valid first and last name.";
        return;
    }

    if (!accessKey) {
        document.getElementById('error-message').textContent = "Enter a valid access key.";
        return;
    }

    if (isValidAccessKey(accessKey)) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                document.getElementById("signingUp").style.display = "block";
                const user = userCredential.user;
                const role = SetRole(accessKey);
                // Add user to Realtime Database
                set(ref(database, 'users/' + user.uid), {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    role: role,
                }).then(() => {
                    // Add user to Firestore 'accounts' collection
                    setDoc(doc(db, "accounts", email), {
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        role: role,
                    }).then(() => {
                        // Add the document to Realtime Database under users.
                        set(ref(database, 'users/' + user.uid), {
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            role: role,
                        }).then(() => {
                            document.getElementById("signingUp").style.display = "none";
                            document.getElementById("info").textContent = "Your account was successfully created. Go back to the sign in page and sign in.";
                            window.location.href = 'index.html';
                        }).catch((error) => {
                            document.getElementById('error-message').textContent = "Error adding document to Realtime Database 'users' node: " + error.message;
                        });
                    }).catch((error) => {
                        document.getElementById('error-message').textContent = "Error adding document to Firestore: " + error.message;
                    });
                }).catch((error) => {
                    document.getElementById('error-message').textContent = "Error adding document to Realtime Database: " + error.message;
                });
            })
            .catch((error) => {
                const errorMessage = SetSignUpError(error, email, password);
                document.getElementById('error-message').textContent = errorMessage;
            });
    } else {
        document.getElementById('error-message').textContent = "Invalid access key.";
    }
});





