import { firestore as db } from './firebaseInit.js';
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { database} from "./firebaseInit.js";
import { ref, get} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { handleRoleChange,handleUserDelete } from "./firebase_functions.js";

// Function to send a notification to a user
const sendNotification = async (userId, message) => {
    try {
        const userDoc = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();
        const userToken = userData.fcmToken;

        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_SERVER_KEY'
            },
            body: JSON.stringify({
                to: userToken,
                data: {
                    message: message
                },
                notification: {
                    title: 'Feedback Request',
                    body: message,
                    click_action: 'YOUR_ACTION_URL'
                }
            })
        });
        console.log('Notification sent successfully!');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

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
    

// Function to load users into the table
const loadUsers = async () => {
    const users = await getAllUsers();
    const usersList = document.getElementById('usersList').getElementsByTagName('tbody')[0];
    usersList.innerHTML = ''; // Clear the existing list

    users.forEach(user => {
        const row = usersList.insertRow();
        row.dataset.userId = user.id;
        row.insertCell(0).textContent = user.firstName;
        row.insertCell(1).textContent = user.lastName;
        row.insertCell(2).textContent = user.email;
        row.addEventListener('click', handleRowClick);
    });

    document.getElementById('send-notification').disabled = true; // Disable the send notification button initially
};

// Function to handle row click
const handleRowClick = (event) => {
    const row = event.currentTarget;
    row.classList.toggle('selected');

    const selectedRows = document.querySelectorAll('#usersList tbody .selected');
    document.getElementById('send-notification').disabled = selectedRows.length !== 2; // Enable the send notification button only if exactly 2 users are selected
};

// Function to handle sending notifications based on selected users
const handleSendNotification = async () => {
    const selectedRows = document.querySelectorAll('#usersList tbody .selected');
    if (selectedRows.length !== 2) {
        alert('Please select exactly two users.');
        return;
    }

    const userId1 = selectedRows[0].dataset.userId;
    const userId2 = selectedRows[1].dataset.userId;

    const userDoc2 = doc(db, 'users', userId2);
    const userSnapshot2 = await getDoc(userDoc2);
    const userData2 = userSnapshot2.data();
    const userName2 = `${userData2.firstName} ${userData2.lastName}`;

    const message = `Please write a feedback report on ${userName2}.`;
    await sendNotification(userId1, message);
    console.log(`Notification sent to ${userId1}`);
};

// Event listeners
document.getElementById('load-more').addEventListener('click', loadUsers);
document.getElementById('send-notification').addEventListener('click', handleSendNotification);

// Initially disable the send notification button until users are loaded
document.getElementById('send-notification').disabled = true;
