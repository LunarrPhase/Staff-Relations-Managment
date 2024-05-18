import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { ref, update, get,query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"
import { doc, updateDoc ,collection,where, getDocs, deleteDoc} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"
import { database, firestore as db } from "./firebaseInit.js";
import { ChangeWindow, SetLoginError, isValidAccessKey, SetRole, SetSignUpError, truncateText ,manageDate, getDayName, sleep} from "./functions.js";




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




export{FirebaseLogin, handleRoleChange, handleUserDelete}