window.addEventListener("DOMContentLoaded", (event) => {

    const mealInfo = document.getElementById('meal-info');
    mealInfo.addEventListener('click', function(event) {
        window.location.href = 'create-meal.html'; 
        console.log('Meal info clicked!');
    });


    const manageUsers = document.getElementById('manage-users')
    manageUsers.addEventListener('click', () => {
        window.location.href = 'manage-users.html'
    });
});
