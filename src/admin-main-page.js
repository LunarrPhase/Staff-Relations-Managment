import { CreateRR } from "./functions.js";

document.addEventListener("DOMContentLoaded", (event) => {

    const mealInfo = document.getElementById('meal-info');
    mealInfo.addEventListener('click', function(event) {

        // Prevent the default action
        event.preventDefault();
        CreateRR();
    });

    const manageUsers = document.getElementById('manage-users');
    manageUsers.addEventListener('click', () => {
        window.location.href = 'manage-users.html'
    });
})
