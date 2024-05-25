import { auth } from "./firebaseInit.js";
import { CreateNewAccount } from "./firebase_functions.js";


document.getElementById('signUp').addEventListener('click', async (e) => {
    e.preventDefault();
    await CreateNewAccount(auth);
});





