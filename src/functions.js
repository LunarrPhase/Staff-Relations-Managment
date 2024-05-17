import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { ref,  update, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import {doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


/* INDEX */
async function FirebaseLogin(auth, database, db, email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const dt = new Date();

        await update(ref(database, 'users/' + user.uid), {
            last_login: dt,
        });

        // Check the Realtime Database for user data
        const userRef = ref(database, 'users/' + user.uid);
        const snapshot = await get(userRef);
        let userData = snapshot.val();
        let role, firstName, lastName;

        if (userData) {
            // User data found in Realtime Database
            role = userData.role || "User";
            firstName = userData.firstName || "";
            lastName = userData.lastName || "";
        } else {
            // User data not found in Realtime Database, check Firestore
            const docRef = doc(db, 'accounts', email);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                userData = docSnap.data();
                role = userData.role || "User";
                firstName = userData.firstName || "";
                lastName = userData.lastName || "";
            } else {
                throw new Error("User data not found in both Realtime Database and Firestore.");
            }
        }

        console.log(userData);
        document.getElementById('greeting').textContent = `Hello ${role} ${firstName} ${lastName}`;

        ChangeWindow(role);
    } catch (error) {
        document.getElementById("authenticating").style.display = "none";
        const errorMessage = SetLoginError(error);
        const errorMessageElement = document.getElementById('error-message');
        errorMessageElement.textContent = errorMessage;
    } finally {
        document.getElementById('loading-message').style.display = 'none';
    }
}




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function ChangeWindow(role){
    
    if (role === "Manager") {
        sleep(5000)
        window.location.href = 'manager-main-page.html';
    }
    else if (role === "HR") {
        sleep(5000)
        window.location.href = 'admin-main-page.html';
    }
    else {
        sleep(5000)
        window.location.href = 'main-page.html';
    }
}



function SetLoginError(error){

    let errorMessage;

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


/* TIMESHEET */


function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text; 
}


/*CAR-WASH BOOKING DATE MANAGEMENT*/

function manageDate(){
    const dateInput = document.getElementById('date');
    
    dateInput.addEventListener('input', () => {
        const selectedDate = new Date(dateInput.value);
        if (selectedDate.getDay() !== 1 && selectedDate.getDay() !== 5) {
            dateInput.value = ''; // Clear the input if an invalid date is selected
            dateInput.setCustomValidity('Please select a Monday or Friday.');
        } else {
            dateInput.setCustomValidity('');
        }
    });

    // Disable dates that are not Fridays or Mondays
    document.addEventListener('DOMContentLoaded', () => {
        const dates = document.querySelectorAll('input[type="date"]');
        dates.forEach(date => {
            date.addEventListener('input', () => {
                const selectedDate = new Date(date.value);
                if (selectedDate.getDay() !== 1 && selectedDate.getDay() !== 5) {
                    date.value = '';
                }
            });
        });
    });
}

function getDayName(year, month, day) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(year, month - 1, day);
    return daysOfWeek[date.getDay()]
}





export{FirebaseLogin, ChangeWindow, SetLoginError, isValidAccessKey, SetRole, SetSignUpError, truncateText ,manageDate, getDayName, sleep};
        

   
  




