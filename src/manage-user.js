import { HandleEvent, LoadUsers } from "./firebase_functions.js";


//ensures page waits for all DOMContent to load
window.addEventListener('DOMContentLoaded', (event) => {

    document.getElementById('filterInput').addEventListener('input', (event) => {
        const filter = event.target.value.trim().toLowerCase();
        LoadUsers(filter);
    });

    document.getElementById('load-more').addEventListener('click', () => {
        LoadUsers()
    });


    document.getElementById('usersList').addEventListener('click', (event) => {
        HandleEvent(event);
    });
});












