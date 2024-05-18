import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { ref, update, get,query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"
import { doc,getDoc, updateDoc ,collection,where, getDocs, deleteDoc} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"
import { database, auth, firestore as db } from "./firebaseInit.js";




/* INDEX */

async function FirebaseLogin(auth, database, db, email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const dt = new Date();
        const userUid = user.uid;

        let role, firstName, lastName;

        // Check if user exists in Realtime Database
        const userRef = ref(database, 'users/' + userUid);
        const snapshot = await get(userRef);
        let userData = snapshot.val();

        if (userData) {
            await update(userRef, { last_login: dt });
            role = userData.role || "User";
            firstName = userData.firstName || "";
            lastName = userData.lastName || "";
        } else {
            // Query Firestore by email to get the document ID
           const accountsQuery = query(collection(db, 'accounts'), where('email', '==', email));
            const querySnapshot = await getDocs(accountsQuery);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                userData = doc.data();
                await updateDoc(doc.ref, { last_login: dt });
                role = userData.role || "User";
                firstName = userData.firstName || "";
                lastName = userData.lastName || "";
            } else {
                throw new Error("User data not found in both Realtime Database and Firestore.");
            }
        }
        ChangeWindow(role);
    } catch (error) {
        console.error("Firebase Error:", error);
        document.getElementById("authenticating").style.display = "none";
        const errorMessage = SetLoginError(error);
        const errorMessageElement = document.getElementById('error-message');
        if (errorMessageElement) {
            errorMessageElement.textContent = errorMessage;
        }
    } finally {
        const loadingMessageElement = document.getElementById('loading-message');
        if (loadingMessageElement) {
            loadingMessageElement.style.display = 'none';
        }
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

/* MANAGE-USERS */
const usersRef = ref(database, 'users');
function handleRoleChange(target) {
    const row = target.closest('tr');
    const userEmail = row.getAttribute('data-user-email');

    const firestoreQuery = collection(db, 'accounts');
    const firestoreUserQuery = query(firestoreQuery, where('email', '==', userEmail));

    getDocs(firestoreUserQuery)
    .then((querySnapshot) => {
        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const userId = doc.id;
                //console.log(userId)
                updateRole(userId, row, 'firestore');
            });
        } else {
            const realtimeQuery = query(usersRef, orderByChild('email'), equalTo(userEmail));
            get(realtimeQuery)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const userId = Object.keys(snapshot.val())[0];
                    updateRole(userId, row, 'realtime');
                } else {
                    console.error('User not found');
                }
            })
            .catch((error) => {
                console.error('Error fetching user data from Realtime Database:', error);
            });
        }
    })
    .catch((error) => {
        console.error('Error fetching user data from Firestore:', error);
    });
}

function updateRole(userId, row, databaseType) {
    document.getElementById('roleModal').style.display = 'block';

    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('roleModal').style.display = 'none';
    });

    document.getElementById('updateRoleBtn').addEventListener('click', () => {
        const selectedRole = document.getElementById('roleSelect').value;
        const updateObj = {};
        updateObj[`users/${userId}/role`] = selectedRole;

        if (databaseType === 'firestore') {
            // Update the role in Firestore
            updateDoc(doc(db, 'accounts', userId), { role: selectedRole })
            .then(() => {
                console.log('Role updated successfully');
                const roleCell = row.querySelector('.role');
                if (roleCell) {
                    roleCell.textContent = selectedRole;
                }
                document.getElementById('roleModal').style.display = 'none';
            })
            .catch((error) => {
                console.error('Error updating role:', error);
            });
        } else if (databaseType === 'realtime') {
            // Update the role in the Realtime Database
            const updates = {};
            updates[`users/${userId}/role`] = selectedRole;
            update(ref(database), updates)
            .then(() => {
                console.log('Role updated successfully');
                const roleCell = row.querySelector('.role');
                if (roleCell) {
                    roleCell.textContent = selectedRole;
                }
                document.getElementById('roleModal').style.display = 'none';
            })
            .catch((error) => {
                console.error('Error updating role:', error);
            });
        }
    });
}


function deleteUser(userId, row, databaseType) {
    if (databaseType === 'firestore') {
        // Delete user from Firestore
        deleteDoc(doc(db, 'accounts', userId))
        .then(() => {
            console.log('User deleted successfully from Firestore');
            row.remove();
            document.getElementById('roleModal').style.display = 'none';
            document.getElementById('confirmationModal').style.display = 'none';
        })
        .catch((error) => {
            console.error('Error deleting user from Firestore:', error);
        });
    } else if (databaseType === 'realtime') {
        // Delete user from Realtime Database
        remove(ref(database, 'users/' + userId))
        .then(() => {
            console.log('User deleted successfully from Realtime Database');
            row.remove();
            document.getElementById('roleModal').style.display = 'none';
            document.getElementById('confirmationModal').style.display = 'none';
        })
        .catch((error) => {
            console.error('Error deleting user from Realtime Database:', error);
        });
    }
}



function handleUserDelete(target) {
    const row = target.closest('tr');
    const userEmail = row.getAttribute('data-user-email');

    document.getElementById('confirmationModal').style.display = 'block';

    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        const firestoreQuery = collection(db, 'accounts');
        const firestoreUserQuery = query(firestoreQuery, where('email', '==', userEmail));

        getDocs(firestoreUserQuery)
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const userId = doc.id;
                    deleteUser(userId, row, 'firestore');
                });
            } else {
                const realtimeQuery = query(usersRef, orderByChild('email'), equalTo(userEmail));
                get(realtimeQuery)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userId = Object.keys(snapshot.val())[0];
                        deleteUser(userId, row, 'realtime');
                    } else {
                        console.error('User not found');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data from Realtime Database:', error);
                });
            }
        })
        .catch((error) => {
            console.error('Error fetching user data from Firestore:', error);
        });
    });

    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        document.getElementById('confirmationModal').style.display = 'none';
    });
}






export{FirebaseLogin, ChangeWindow, SetLoginError, isValidAccessKey, SetRole, SetSignUpError, truncateText ,manageDate, getDayName, sleep, handleRoleChange, handleUserDelete};






  






