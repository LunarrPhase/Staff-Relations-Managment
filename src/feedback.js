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

const feedbackElement = document.getElementById('feedbackButton');

feedbackElement.addEventListener('click', async () => {
  //getting current user
  const user = auth.currentUser;
  console.log("clicked!")

  if (user) {
    try {
      
      const userRef = ref(realtimeDb, 'users/' + user.uid)

      get(userRef).then((snapshot) => {
        const userData = snapshot.val();
        const role = userData.role;
        if (role === "Manager") {
          window.location.href = 'manager-main-page.html'
        } else if (role === "HR") {
          window.location.href = 'admin-main-page.html'
        } else {
          window.location.href = 'main-page.html'
        }
      });
    } catch (error) {
      console.error("Error getting user role:", error)
    }
  } else {
    window.location.href = 'index.html'
  }
})

const checkEmailExists = async (email) => {
  const usersRef = ref(realtimeDb, 'users')
  const snapshot = await get(usersRef)
  const users = snapshot.val()

  for (const key in users) {
    if (users[key].email === email) {
      return true
    }
  }

  return false
};
const form = document.querySelector('form')

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const recipient = document.getElementById('recipient').value;
  const type = document.getElementById('type').value;
  const message = document.getElementById('message').value;

  const user = auth.currentUser;
  const userRef = ref(realtimeDb, 'users/' + user.uid);

  let email = null;

  try {
    const snapshot = await get(userRef);
    const userData = snapshot.val();
    email = userData.email;
  } catch (error) {
    console.error("Error getting user email:", error);
  }

  try {
    const emailExists = await checkEmailExists(recipient);
    if (!emailExists) {
      // Email does not exist, show notification
      alert('The entered email does not exist.');
      return;
    }
  
    try {
      await addDoc(collection(db, 'feedback'), {
        message: message,
        recipient: recipient,
        type: type,
        sender: email 
      });

      const modal = document.getElementById('myModal');
      modal.style.display = 'block';

      const closeButton = document.getElementsByClassName('close')[0];
      closeButton.onclick = function() {
        modal.style.display = 'none';
      };
      form.reset();
    } catch (error) {
      console.error('Error adding feedback: ', error);
    }
  } catch (error) {
    console.error('Error checking email existence:', error);
  }
});


