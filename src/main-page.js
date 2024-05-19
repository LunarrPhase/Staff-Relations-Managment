import { database, auth, firestore as db} from "./firebaseInit.js"
import { ref,  update, get} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc,updateDoc, getDoc} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"


document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault()
    const loading = document.getElementById('loading');
    if(loading){
    loading.style.display = 'block'; // Show loading animation
    }
    
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
              
                const waveImagePath = "wave.svg";  // Ensure this path is correct

if (role === "Manager") {
    document.getElementById('userInfo').innerHTML = `Hello, ${firstName} (Manager) <img src="${waveImagePath}" alt="Profile Picture" style="width:70px; height:70px;">`;
} else if (role === "HR") {
    document.getElementById('userInfo').innerHTML = `Hello, ${firstName} (HR) <img src="${waveImagePath}" alt="Profile Picture" style="width:70px; height:70px;">`;
} else {
    document.getElementById('userInfo').innerHTML = `Hello, ${firstName} (Employee) <img src="${waveImagePath}" alt="Profile Picture" style="width:70px; height:70px;">`;
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
            const user = auth.currentUser;
            const userUid = user.uid;
            const email = user.email;
    
            
            const userRef = ref(database, 'users/' + userUid);
            const snapshot = await get(userRef);
    
            if (snapshot.exists()) {
                
                await update(userRef, {
                    last_logout: dt,
                });
            } else {
                
                const accountDocRef = doc(db, 'accounts', email);
                const docSnap = await getDoc(accountDocRef);
    
                if (docSnap.exists()) {
    
                    await updateDoc(accountDocRef, {
                        last_logout: dt,
                    });
                } else {
                    throw new Error("User data not found in both Realtime Database and Firestore.");
                }
            }
    
            await signOut(auth);
    
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Logout Error:", error);
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