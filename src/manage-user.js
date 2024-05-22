import { database} from "./firebaseInit.js";
import { ref, get} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { handleRoleChange,handleUserDelete, handleFeedbackRequest } from "./firebase_functions.js";

//ensures page waits for all DOMContent to load
document.addEventListener('DOMContentLoaded', function() {


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

            //filters users based on the provided filter
            if (filter) {
                const filterLower = filter.toLowerCase();
                users = users.filter(user =>
                    user.firstName.toLowerCase().includes(filterLower) ||
                    user.lastName.toLowerCase().includes(filterLower) ||
                    user.role.toLowerCase().includes(filterLower)
                );
            }

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
                            <span class="fa-solid fa-user-xmark fa-fw" style="cursor: pointer;" title="Delete User Account">
                                <div id="confirmationModal" class="modal">
                                    <div class="modal-content">
                                        <p>Are you sure you want to delete this user?</p>
                                        <button id="confirmDeleteBtn">Yes</button>
                                        <button id="cancelDeleteBtn">No</button>
                                    </div>
                                </div>
                            </span>
                            <span class="fa-solid fa-circle-plus" style="cursor: pointer;" data-user-email="${user.email}" title="Change User Role">
                                <div id="roleModal" class="modal">
                                    <div class="modal-content">
                                        <p>Update User Role</p>
                                        <span class="close">&times;</span>
                                        <select id="roleSelect" class="form-select">
                                        <option selected disabled hidden>Select a role...</option>
                                        <option value="HR">HR</option>
                                        <option value="Staff">Staff</option>
                                        <option value="Manager">Manager</option>
                                        
                                        </select>
                                        <button id="updateRoleBtn">Save changes</button>
                                    </div>
                                </div>
                            </span>
                            <span class="fa-solid fa-bell" style="cursor: pointer;" data-user-email="${user.email}" title="Send feedback request"></span>
                            <div id="feedbackModal" class="modal">
                            <div class="modal-content">
                                <span class="close">&times;</span>
                                <h2>Request Feedback</h2>
                                <label for="feedbackEmailInput">Recipient Email:</label>
                                <input type="email" id="feedbackEmailInput" placeholder="Enter recipient's email">
                                <button id="sendFeedbackRequestBtn">Send Feedback Request</button>
                            </div>
                        </div>
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
    if (target.classList.contains('fa-bell')) {
        handleFeedbackRequest(target)
   
    }
});

});












