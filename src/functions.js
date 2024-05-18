import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { ref, update, get,query, orderByChild, equalTo , remove} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"
import { doc,collection,where, getDocs, deleteDoc, query as firestoreQuery} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"
import { database, firestore as db } from "./firebaseInit.js";




/* INDEX */

async function FirebaseLogin(auth, database, email, password) {
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
        } /*else {
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
        }*/
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
    else if(error.code === "auth/user-not-found"){
        errorMessage = "No account associated with this email address."
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
//makes sure only fridays and mondays are bookable.
function manageDate(){
    const dateInput = document.getElementById('date');
    
    dateInput.addEventListener('input', () => {
        const selectedDate = new Date(dateInput.value);
        if (selectedDate.getDay() !== 1 && selectedDate.getDay() !== 5) {
            dateInput.value = ''; 
            dateInput.setCustomValidity('Please select a Monday or Friday.');
        } else {
            dateInput.setCustomValidity('');
        }
    });

    // disable dates that are not Fridays or Mondays
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

    const row = target.closest('tr')
    const userEmail = row.getAttribute('data-user-email')

    const usersQuery = query(usersRef, orderByChild('email'), equalTo(userEmail))

    get(usersQuery)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const userId = Object.keys(snapshot.val())[0]

            document.getElementById('roleModal').style.display = 'block'

            document.querySelector('.close').addEventListener('click', () => {
                document.getElementById('roleModal').style.display = 'none'
            })

            // Save changes
            document.getElementById('updateRoleBtn').addEventListener('click', () => {
                const selectedRole = document.getElementById('roleSelect').value

                console.log(userId)
                const updateObj = {}
                updateObj['users/' + userId + '/role'] = selectedRole

                update(ref(database), updateObj)
                .then(() => {
                    console.log('Role updated successfully');
                    const roleCell = row.querySelector('.role')
                    if (roleCell) {
                        roleCell.textContent = selectedRole;
                    }
                    document.getElementById('roleModal').style.display = 'none'
                })
                .catch((error) => {
                    console.error('Error updating role:', error)
                })
            })
        }
        else {
            console.error('User not found')
        }
    })
    .catch((error) => {
        console.error('Error fetching user data:', error);
    })
}

function handleUserDelete(target) {
    const row = target.closest('tr');
    const userEmail = row.getAttribute('data-user-email');

    const usersQuery = query(usersRef, orderByChild('email'), equalTo(userEmail));
    get(usersQuery)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userId = Object.keys(snapshot.val())[0];
               

                document.getElementById('confirmationModal').style.display = 'block';

                document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
                    try {
                        // Remove user from Realtime Database
                        await remove(ref(database, 'users/' + userId));
                        console.log('User deleted successfully from Realtime Database');

                        // Remove user from Firestore
                        const usersCollection = collection(db, 'accounts');
                        const firestoreQuerySnapshot = await getDocs(firestoreQuery(usersCollection, where('email', '==', userEmail)));
                        firestoreQuerySnapshot.forEach(async (firestoreDoc) => {
                            await deleteDoc(doc(db, 'accounts', firestoreDoc.id));
                            console.log('User deleted successfully from Firestore');
                        });

                        // Update UI
                        row.remove();
                        document.getElementById('roleModal').style.display = 'none';
                        document.getElementById('confirmationModal').style.display = 'none';
                    } catch (error) {
                        console.error('Error deleting user:', error);
                    }
                });

                document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
                    document.getElementById('confirmationModal').style.display = 'none';
                });
            } else {
                console.error('User not found');
            }
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
        });
}







export{FirebaseLogin, ChangeWindow, SetLoginError, isValidAccessKey, SetRole, SetSignUpError, truncateText ,manageDate, getDayName, sleep, handleRoleChange, handleUserDelete};






  






