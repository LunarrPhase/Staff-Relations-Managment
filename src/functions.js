import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { ref,  update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";


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
            const errorMessage = SetErrorMessage(error);
            const errorMessageElement = document.getElementById('error-message');
            errorMessageElement.textContent = errorMessage;
        });
}


function SetErrorMessage(error){

    let errorMessage;
    console.log(error.code);

    if (error.code === "auth/invalid-email") {
        errorMessage = "Please provide a valid email address.";
    }
    else if(error.code === "auth/invalid-credential"){
        errorMessage = "Wrong email or password. Please try again."
    }
    else {
        errorMessage = "An error occurred. Please try again later.";
    }

    return errorMessage;
}


function isValidAccessKey(accessKey) {
    return accessKey === "mR123123" || accessKey === "hR456456" || accessKey === "uR789789";
}


export{FirebaseLogin, SetErrorMessage, isValidAccessKey};