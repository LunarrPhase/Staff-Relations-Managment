import { database as realtimeDb, auth, onAuthStateChanged } from './firebaseInit.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { ChangeWindow } from './functions.js';

document.addEventListener("DOMContentLoaded", function() {
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userRef = ref(realtimeDb, 'users/' + user.uid);
            const snapshot = await get(userRef);
        }
        catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
    else {
        console.log("User is signed out");
    }

//code to send the user to the right home page for the back and home button
const goHome = document.getElementById('home')
const backButton = document.getElementById('back-btn')


goHome.addEventListener('click', async () => {
  
    //getting current user
    const user = auth.currentUser;
    

    if (user) {
        try {
            const userRef = ref(realtimeDb, 'users/' + user.uid)

            get(userRef).then((snapshot) => {
                //depending on the users role we will send them to the right home page
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


backButton.addEventListener('click', async () => {
   
    //getting current user
    const user = auth.currentUser;
   

    if (user) {
        try {
            const userRef = ref(realtimeDb, 'users/' + user.uid)
            get(userRef).then((snapshot) => {

                const userData = snapshot.val();
                const role = userData.role;
                
                if (role === "Manager") {
                    window.location.href = 'manager-main-page.html'
                }
                else if (role === "HR") {
                    window.location.href = 'admin-main-page.html'
                } 
                else {
                    window.location.href = 'main-page.html'
                }
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
});
});
