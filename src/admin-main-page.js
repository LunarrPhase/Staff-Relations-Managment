const mealInfo = document.getElementById('meal-info');
mealInfo.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default action

    const link = document.createElement('a');
    link.href = 'https://youtu.be/xvFZjo5PgG0?si=j54z27hdpHLeZyP6';
    link.target = '_blank';

    link.click();
    //console.log('Meal info clicked!');
});



const manageUsers = document.getElementById('manage-users')
manageUsers.addEventListener('click', () => {
    window.location.href = 'manage-users.html'
})
