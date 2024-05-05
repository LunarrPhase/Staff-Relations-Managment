import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

 
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

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const realtimeDb = getDatabase(app);



// Function to send a notification to a user
const sendNotification = async (userId, message) => {
  try {
    // Retrieve user's FCM token from the database
    const userDoc = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDoc);
    const userData = userSnapshot.data();
    const userToken = userData.fcmToken;

    // Send the notification using FCM
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
        name: userData.name,
        email: userData.email
      });
    });

    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Function to select users and initiate the feedback process
const selectUsersForFeedback = async () => {
    try {
      // Get all users from the database
      const users = await getAllUsers();
  
      // Display a list of users to the admin
      console.log('Users:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`);
      });
  
      // Prompt the admin to select two users
      const selectedUserIndices = [];
      for (let i = 0; i < 2; i++) {
        const selectedUserIndex = parseInt(prompt(`Select user ${i + 1} by entering the corresponding number:`));
        if (isNaN(selectedUserIndex) || selectedUserIndex < 1 || selectedUserIndex > users.length) {
          console.log(`Invalid user selection for user ${i + 1}.`);
          return;
        }
        selectedUserIndices.push(selectedUserIndex);
      }
  
      const selectedUsers = selectedUserIndices.map(index => users[index - 1]);
  
      // Prompt the admin to enter a message for the first user
      const message = prompt('Enter a message for the first user:');
  
      // Send the notification to the first user
      await sendNotification(selectedUsers[0].id, message);
  
      console.log(`Notification sent to ${selectedUsers[0].name} (${selectedUsers[0].email})`);
  
      console.log(`Please ask ${selectedUsers[0].name} to write a report about ${selectedUsers[1].name} (${selectedUsers[1].email}).`);
  
    } catch (error) {
      console.error('Error selecting users for feedback:', error);
    }
  };
  
  // Call the function to select users and send notifications
  selectUsersForFeedback();