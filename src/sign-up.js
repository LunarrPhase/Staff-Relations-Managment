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



