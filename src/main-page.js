import { database, auth } from "./firebaseInit.js"
import { ref,  update, get} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";



document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault()
    const loading = document.getElementById('loading');
    loading.style.display = 'block'; // Show loading animation

    
    //get the currently signed in user
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {

                //console.log("User ID:", user.uid);
                const userRef = ref(database, 'users/' + user.uid);
                const snapshot = await get(userRef);
                const userData = snapshot.val();
                //console.log(userData);
                const firstName = userData.firstName || "Unknown";
                const role = userData.role || "User";
              
                if (role === "Manager") {
                    document.getElementById('userInfo').textContent = `Hello, Manager ${firstName}`;
                }
                else if (role === "HR") {
                    document.getElementById('userInfo').textContent = `Hello, HR ${firstName}`;
                }
                else {
                    document.getElementById('userInfo').textContent = `Hello, User ${firstName}`;
                }
          
                loading.style.display = 'none'
            }
            catch (error) {
                console.error("Error fetching user data:", error);
                loading.style.display = 'none';
            }
        }
        else {
            //console.log("User is signed out")
            loading.style.display = 'none'
        }
    });

    //i added logout time-might help with timesheets.
    const logout = document.getElementById("logout");
    const logoutTab = async (e) => {

        e.preventDefault();
        try {
            const dt = new Date();
            await update(ref(database, 'users/' + auth.currentUser.uid), {
                last_logout: dt,
            });

            await signOut(auth);
            window.location.href = 'index.html';
        }
        catch (error) {
            console.log(error.code);
        }
    };
    logout.addEventListener("click", logoutTab);

    const notifications = document.getElementById('notifications');
    const popoverContent = document.getElementById('popover-content');

    notifications.addEventListener('click', function(event) {
    //event.preventDefault(); 
        popoverContent.classList.toggle('show-popover');
    });

    document.addEventListener('click', function(event) {
        if (!popoverContent.contains(event.target) && !notifications.contains(event.target)) {
            popoverContent.classList.remove('show-popover');
        }
    });

    const giveFeedback = document.getElementById('feedback-button')
    giveFeedback.addEventListener('click', ()=>{
        window.location.href = 'feedback.html'
    })
});