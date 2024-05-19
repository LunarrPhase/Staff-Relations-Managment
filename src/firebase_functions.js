import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { ref, update, get,query, orderByChild, equalTo, remove} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"
import { doc, updateDoc ,collection,where, getDocs, deleteDoc, query as firestoreQuery} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"
import { database, firestore as db } from "./firebaseInit.js";
import { ChangeWindow, SetLoginError, getDayName } from "./functions.js";


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

                        // Update table visually immediately
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
    });

    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        document.getElementById('confirmationModal').style.display = 'none';
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


export{FirebaseLogin, handleRoleChange, handleUserDelete, getCarwashBookings}