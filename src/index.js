import { database, auth } from "./firebaseInit.js"
import { FirebaseLogin } from "./functions.js";


<<<<<<< HEAD

=======
>>>>>>> 5894fb4896d3b8cd6bb24cb37a178dffbc279934
login.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    //document.getElementById('loading-message').style.display = 'block';

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const dt = new Date();

        await update(ref(database, 'users/' + user.uid), {
            last_login: dt,
        });

        const userRef = ref(database, 'users/' + user.uid);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        const role = userData.role || "User"
        console.log(userData)

                if (role === "Manager") {
                    window.location.href = 'manager-main-page.html';
                } else if (role === "HR") {
                    window.location.href = 'admin-main-page.html';
                } else {
                    window.location.href = 'main-page.html';
                }
    } catch (error) {
        let errorMessage;

        if (error.code === "auth/invalid-email") {
            errorMessage = "Please provide a valid email address.";
        } else if (error.code === "auth/wrong-password") {
            errorMessage = "Wrong email or password. Please try again.";
        } else {
            console.log(error)
            errorMessage = "An error occurred. Please try again later.";
        }

        const errorMessageElement = document.getElementById('error-message');
        errorMessageElement.textContent = errorMessage;
    } finally {
        document.getElementById('loading-message').style.display = 'none';
    }
});
