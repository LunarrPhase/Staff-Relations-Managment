import { database as realtimeDb, auth, firestore as db} from './firebaseInit.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { ChangeWindow } from './functions.js';

 
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
            ChangeWindow(role);
        });
    }
    catch (error) {
        console.error("Error getting user role:", error)
    }
  }
    else {
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
    }
    catch (error) {
        console.error("Error getting user email:", error);
    }

    try {
        const emailExists = await checkEmailExists(recipient);
        if (!emailExists) {
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
        }
        catch (error) {
            console.error('Error adding feedback: ', error);
        }
    }
    catch (error) {
        console.error('Error checking email existence:', error);
    }
});

