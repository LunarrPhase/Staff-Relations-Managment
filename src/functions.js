import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { ref,  update, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";


/* INDEX */


async function FirebaseLogin(auth, database, email, password){

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

        GetRole(role);
    }
    catch (error) {

        const errorMessage = SetLoginError(error);
        const errorMessageElement = document.getElementById('error-message');
        errorMessageElement.textContent = errorMessage;
    }
    finally {
        document.getElementById('loading-message').style.display = 'none';
    }
}


function GetRole(role){

    if (role === "Manager") {
        window.location.href = 'manager-main-page.html';
    }
    else if (role === "HR") {
        window.location.href = 'admin-main-page.html';
    }
    else {
        window.location.href = 'main-page.html';
    }
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


function SetRole(accessKey){

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


function SetSignUpError(error, email, password){

    let errorMessage;

    if (error.code === "auth/email-already-in-use") {
        errorMessage = "The email used to sign up already exists. Please use a different email.";
    }
    else if (error.code === "auth/invalid-email" || email === "") {
        errorMessage = "Please provide a valid email address."
    }
    else if (password === "") {
        errorMessage = "Please create a password."
    }
    else if(error.code === "auth/invalid-password"){
        errorMessage = "Password must be atleast 6 characters."
    }
    else {
        errorMessage = "An error occurred. Please try again later.";
    }
    return errorMessage;
}


export{FirebaseLogin, GetRole, SetLoginError, isValidAccessKey, SetRole, SetSignUpError};