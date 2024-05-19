import { firestore as db } from './firebaseInit.js';
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

// Function to get all users from the database
const getAllUsers = async () => {
    try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const users = [];

        usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            users.push({
                id: doc.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email
            });
        });

        return users;
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
};

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
