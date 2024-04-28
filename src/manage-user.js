import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref,get,update,query, orderByChild, equalTo, remove} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCdhEnmKpeusKPs3W9sQ5AqpN5D62G5BlI",
  authDomain: "staff-relations-management.firebaseapp.com",
  databaseURL: "https://staff-relations-management-default-rtdb.firebaseio.com",
  projectId: "staff-relations-management",
  storageBucket: "staff-relations-management.appspot.com",
  messagingSenderId: "5650617468",
  appId: "1:5650617468:web:4892625924b0cf6b3ee5f9",
  measurementId: "G-7J5915RDP9"
};


const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

const usersRef = ref(database, 'users')

function loadUsers() {
    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            let html = ''
            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val()
                if (user.firstName && user.lastName && user.role) {
                    html += `
                        <tr data-user-email="${user.email}">
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td class="role">${user.role}</td>
                            <td>${user.email}</td>
                            <td>
                                <span class="fa-solid fa-user-xmark fa-fw" style="cursor: pointer;">
                                <div id="confirmationModal" class="modal">
                                    <div class="modal-content">
                                        <p>Are you sure you want to delete this user?</p>
                                        <button id="confirmDeleteBtn">Yes</button>
                                        <button id="cancelDeleteBtn">No</button>
                                    </div>
                                </div>
                                </span>
                                <span class="fa-solid fa-circle-plus" style="cursor: pointer;" data-user-email="${user.email}">
                                <div id="roleModal" class="modal">
                                <div class="modal-content">
                                    <p>Update User Role</p>
                                    <span class="close">&times;</span>
                                    <select id="roleSelect" class="form-select">
                                        <option selected>Select a role...</option>
                                        <option value="HR">HR</option>
                                        <option value="Staff">Staff</option>
                                        <option value="Manager">Manager</option>
                                    </select>
                                    <button id="updateRoleBtn">Save changes</button>
                                </div>
                                </div>
                            

                                </span>
                            </td>
                        </tr>
                    `
                }
            })
            document.getElementById('usersList').innerHTML = html
        } else {
            console.log('No data available')
        }
    }).catch((error) => {
        console.error(error)
    })
}

loadUsers()
document.getElementById('load-more').addEventListener('click', loadUsers)


document.getElementById('usersList').addEventListener('click', (event) => {
    const target = event.target
    if (target.classList.contains('fa-circle-plus')) {
        handleRoleChange(target)
    } if (target.classList.contains('fa-user-xmark')) {
        handleUserDelete(target)
    }
});

function handleRoleChange(target) {
    const row = target.closest('tr')
    const userEmail = row.getAttribute('data-user-email')

    const usersQuery = query(usersRef, orderByChild('email'), equalTo(userEmail))
    get(usersQuery)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userId = Object.keys(snapshot.val())[0]
                console.log('User ID:', userId);

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
            } else {
                console.error('User not found')
            }
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
        })
}

function handleUserDelete(target) {
    const row = target.closest('tr');
    const userEmail = row.getAttribute('data-user-email')

    const usersQuery = query(usersRef, orderByChild('email'), equalTo(userEmail))
    get(usersQuery)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userId = Object.keys(snapshot.val())[0]
                console.log('User ID:', userId)

                document.getElementById('confirmationModal').style.display = 'block'

                document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
                    remove(ref(database, 'users/' + userId))
                        .then(() => {
                            console.log('User deleted successfully')
                            row.remove()
                            document.getElementById('roleModal').style.display = 'none'
                            document.getElementById('confirmationModal').style.display = 'none'
                        })
                        .catch((error) => {
                            console.error('Error deleting user:', error)
                        });
                });

                document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
                    document.getElementById('confirmationModal').style.display = 'none'
                });
            } else {
                console.error('User not found')
            }
        })
        .catch((error) => {
            console.error('Error fetching user data:', error)
        })
}












