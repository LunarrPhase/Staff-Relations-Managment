import { database } from "./firebaseInit.js";
import { ref, get, update, query, orderByChild, equalTo, remove} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";


const usersRef = ref(database, 'users');
function loadUsers(filter) {
    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            let users = [];

            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                if (user.firstName && user.lastName && user.role) {
                    users.push(user);
                }
            });

            // Filter users based on the provided filter
            if (filter) {
                const filterLower = filter.toLowerCase();
                users = users.filter(user =>
                    user.firstName.toLowerCase().includes(filterLower) ||
                    user.lastName.toLowerCase().includes(filterLower) ||
                    user.role.toLowerCase().includes(filterLower)
                );
            }

            // Sort the filtered users array alphabetically by firstName
            users.sort((a, b) => (a.firstName > b.firstName) ? 1 : -1);

            let html = '';
            users.forEach((user) => {
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
                `;
            });
            document.getElementById('usersList').innerHTML = html;
        }
        else {
            console.log('No data available');
        }
    })
    .catch((error) => {
        console.error(error);
    });
}

document.getElementById('filterInput').addEventListener('input', (event) => {
    const filter = event.target.value.trim().toLowerCase();
    loadUsers(filter);
})

document.getElementById('load-more').addEventListener('click', () => {
    loadUsers()
})

document.getElementById('usersList').addEventListener('click', (event) => {
    
    const target = event.target
    
    if (target.classList.contains('fa-circle-plus')) {
        handleRoleChange(target)
    }
    
    if (target.classList.contains('fa-user-xmark')) {
        handleUserDelete(target)
    }
})


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
        }
        else {
            console.error('User not found')
        }
    })
    .catch((error) => {
        console.error('Error fetching user data:', error)
    })
}












