import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { ref, update, get,query, orderByChild, equalTo, remove} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"
import { doc, updateDoc, collection, where, getDocs, deleteDoc, query as firestoreQuery} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"
import { database, firestore as db } from "./firebaseInit.js";
<<<<<<< HEAD
import { ChangeWindow, SetLoginError, isValidAccessKey, SetRole, SetSignUpError, truncateText ,manageDate, getDayName, sleep, sendNotification} from "./functions.js";
=======
import { renderMeals, ChangeWindow, SetLoginError, getDayName } from "./functions.js";
>>>>>>> e9a75356f0feb094d89b20ab0cfcbf45241ee181


/* ALL MEAL BOOKINGS */


//access firebase, then document for the day...
async function displayBookings(selectedDate) {
   
    const bookingsRef = collection(db, 'mealOrders')
    const querySnapshot = await getDocs(query(bookingsRef, where('date', '==', selectedDate)))
    const usersList = document.getElementById('usersList')

    renderMeals(querySnapshot, usersList);
}


//i made this to be able to view all users without filtering by date.
async function displayAllBookings() {

    const bookingsRef = collection(db, 'mealOrders')
    const querySnapshot = await getDocs(query(bookingsRef))
    const usersList = document.getElementById('usersList');

    renderMeals(querySnapshot, usersList);
}


/* ALL NOTIFS */


async function SendHome(user){

    if (user) {
        try {
            //goes to their database in users
            const userRef = ref(database, 'users/' + user.uid)
            get(userRef).then((snapshot) => {

                const userData = snapshot.val();
                const role = userData.role;
                // baisically this makes sure they go to the correct home screen
                ChangeWindow(role);
            });
        }
        catch (error) {
            console.error("Error getting user role:", error);
        }
    }
    else {
        window.location.href = 'index.html'
    }
}


async function GetCurrentUserMealBookings(user){

        //get current user id
        const userId = user.uid;

        if (!userId) {
            console.error("User ID not available");
            SendHome(user);

        }

        //get todays date and convert it to string
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format
        console.log("getting date");
        //the refrence to their meal bookings in firestore
        const mealOrdersRef = collection(db, `users/${userId}/mealOrders`);

        //get the meal bookings that match todays date    
        const querySnapshot = await getDocs(query(mealOrdersRef, where('date', '==', todayString)));

        const mealBookings = [];
        querySnapshot.forEach((doc) => {
            mealBookings.push(doc.data());
        });

        //return the data on todays meal bookings
        return mealBookings;
}


async function GetCurrentUserCarWashBookings(user){

    const userId = user.uid;
        
    //gry todays date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format
    
    //fetch the users car wash bookings
    const carWashBookingsRef = collection(db, `users/${userId}/carwashBookings`);
    
    //compare the datas 
    const querySnapshot = await getDocs(query(carWashBookingsRef, where('date', '==', todayString)));
    const carWashBookings = [];
    querySnapshot.forEach((doc) => {
        carWashBookings.push(doc.data());
    });
    return carWashBookings;
}


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

/* ALL CARWASH BOOKINGS */


async function getCarwashBookings(date) {

    const [year, month, day] = date.split('-')
    const dateString = `${year}-${month}-${day}`
    const dayName = getDayName(year, month, day)
    const fullDateString = `${dateString}-${dayName}`
    console.log('Querying for date:', fullDateString)

    const bookings = []
    const bookingRef = collection(db, 'carWashBookings', fullDateString, 'daySlotBookings');
    const bookingSnapshot = await getDocs(bookingRef)
    for (const bookingDoc of bookingSnapshot.docs) {
        const slotRef = collection(db, 'carWashBookings', fullDateString, 'daySlotBookings', bookingDoc.id, 'bookedSlots');
        const slotSnapshot = await getDocs(slotRef)
        slotSnapshot.forEach(slotDoc => {
            bookings.push(slotDoc.data())
        });
    }
    return bookings
}

function HandleFeedback () {
    const selectElement = document.getElementById('userSelect');
    const selectedUserEmail = selectElement.value;

    const message = `Please write feedback on ${selectedUserEmail}.`; // Message to be sent in the notification

    // Check if a user is selected
    if (selectedUserEmail) {
        sendNotification(selectedUserEmail, message); // Send the notification
        // You can add any additional logic here, such as displaying a success message or closing the modal
        console.log('Feedback notification sent successfully!');
    } else {
        // Handle case where no user is selected
        console.error('No user selected for feedback.');
    }
}

<<<<<<< HEAD

export{FirebaseLogin, handleRoleChange, handleUserDelete, HandleFeedback}
=======
export{displayBookings, displayAllBookings, SendHome, GetCurrentUserMealBookings, GetCurrentUserCarWashBookings, FirebaseLogin, handleRoleChange, handleUserDelete, getCarwashBookings}
>>>>>>> e9a75356f0feb094d89b20ab0cfcbf45241ee181
