import { auth, onAuthStateChanged } from "./firebaseInit.js"
import { LogOut, SetGreeting } from "./firebase_functions.js";


document.addEventListener('DOMContentLoaded', (event) => {

    event.preventDefault();

    const loading = document.getElementById('loading');
    const notifications = document.getElementById('notifications');
    const popoverContent = document.getElementById('popover-content');
    const logout = document.getElementById("logout");
    const giveFeedback = document.getElementById('feedback-button');
    
    //get the currently signed in user
    onAuthStateChanged(auth, async (user) => {
        SetGreeting(user);
    });

    
    logout.addEventListener("click", async () => {
        e.preventDefault();
        await LogOut(user);
    });


    notifications.addEventListener('click', function(event) {
        popoverContent.classList.toggle('show-popover');
    });

    document.addEventListener('click', function(event) {
        if (!popoverContent.contains(event.target) && !notifications.contains(event.target)) {
            popoverContent.classList.remove('show-popover');
        }
    });

    giveFeedback.addEventListener('click', ()=>{
        window.location.href = 'feedback.html'
    });

    loading.style.display = 'block'; // Show loading animation
});