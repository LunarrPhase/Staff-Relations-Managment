import { doBooking } from "./firebase_functions.js";


/* ADMIN MAIN PAGE */


function CreateRR(){

    const link = document.createElement('a');
    link.href = 'https://youtu.be/xvFZjo5PgG0?si=j54z27hdpHLeZyP6';
    link.target = '_blank';
    link.click();
}


/*CAR-WASH BOOKING DATE MANAGEMENT*/


//makes sure only fridays and mondays are bookable.
function manageDate(dateInput){

    dateInput.addEventListener('input', () => {

        const selectedDate = new Date(dateInput.value);
        if (selectedDate.getDay() !== 1 && selectedDate.getDay() !== 5) {
            dateInput.value = ''; 
            dateInput.setCustomValidity('Please select a Monday or Friday.');
        }
        else {
            dateInput.setCustomValidity('');
        }
    });

    // disable dates that are not Fridays or Mondays
    document.addEventListener('DOMContentLoaded', () => {
        const dates = document.querySelectorAll('input[type="date"]');
        dates.forEach(date => {
            date.addEventListener('input', () => {
                const selectedDate = new Date(date.value);
                if (selectedDate.getDay() !== 1 && selectedDate.getDay() !== 5) {
                    date.value = '';
                }
            });
        });
    });
}


function getDayName(year, month, day) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(year, month - 1, day);
    return daysOfWeek[date.getDay()]
}


function renderBookings(bookings, usersList) {
    usersList.innerHTML = '';
    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.name}</td>
            <td>${booking.email}</td>
            <td>${booking.type}</td>
            <td>${booking.slot}</td>
            <td>${booking.day}</td>

        `
        usersList.appendChild(row)
    })
}


/* ALL MEAL BOOKINGS */


function renderMeals(querySnapshot, usersList){

    usersList.innerHTML = ''

    querySnapshot.forEach((doc) => {
        const bookingData = doc.data()
        const row = document.createElement('tr')

        if(bookingData.email){
            row.innerHTML = `
            <td>${bookingData.name}</td>
            <td>${bookingData.email}</td>
            <td>${bookingData.diet}</td>
            <td>${bookingData.date}</td>
        `
        }
        usersList.appendChild(row);
    })
}


/* ALL NOTIFS */


function CheckUserAuthenticated(auth){

    try {
        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            return null;
        }
        return user;
    }
    catch(error){
        console.error("Error fetching data: ", error);
        return null;
    }
}


function CreateMealNotificationElements(mealBookings){

    const notificationElements = mealBookings.map((mealBooking) => {

        const notificationElement = document.createElement('div');
        notificationElement.classList.add('notification');
        const mealText = `Today you booked a ${mealBooking.diet} meal of: ${mealBooking.meal}.`;
        notificationElement.innerText = mealText;
        return notificationElement;
    });
    return notificationElements;
}


function CreateCarWashNotificationElement(carWashBookings){

    const notificationElements = carWashBookings.map((carWashBooking) => {
        
        const notificationElement = document.createElement('div');
        notificationElement.classList.add('notification');

        const notificationText = `Today you booked a ${carWashBooking.type} car wash for today's ${carWashBooking.slot} slot.`;
        notificationElement.innerText = notificationText;

        return notificationElement;
    });
    return notificationElements;
}



function CreateFeedbackNotificationElement(feedbackNotifications) {

    const notificationElements = feedbackNotifications.map((notification) => {
    const notificationElement = document.createElement('div');

        notificationElement.classList.add('notification');

	console.log(notification.recipient);

        const notificationText = `Please give feedback to ${notification.recipient}.`;

        notificationElement.innerText = notificationText;



        return notificationElement;

    });

    return notificationElements;

}



function PopulateNotifications(notificationContainer, combinedNotificationElements){

    combinedNotificationElements.forEach((element) => {

        notificationContainer.appendChild(element);

    });

}



/* BOOK CAR WASH */


function areInputsSelected(day, typeCarwash) {
    return day.value !== "" && typeCarwash.value !== "";
}


async function SubmitBooking(user){

    const typeCarwash = document.getElementById('carWashType');
    const timeSlot = document.getElementById('timeSlot');
    const day = document.getElementById('date');

    if (areInputsSelected(day, typeCarwash)) {
        doBooking(typeCarwash, timeSlot, day, user);
    } 
    else alert("Please select both date and time slot.");
}


async function BookCarWash(user){

    if (user) {
        const submit = document.getElementById('submit-btn');
        
        if (submit) {

            submit.addEventListener('click', async (e) => {
                e.preventDefault();
                SubmitBooking(user)
            });
        }
    }
    else {
        console.error("No user is signed in.");
    }
}


/* LOGIN */


function ChangeWindow(role){
    
    if (role === "Manager") {
        window.location.href = 'manager-main-page.html';
    }
    else if (role === "HR") {
        window.location.href = 'admin-main-page.html';
    }
    else {
        window.location.href = 'main-page.html';
    }
}


function SetLoginError(error){

    let errorMessage;

    if (error.code === "auth/invalid-email") {
        errorMessage = "Please provide a valid email address.";
    }
    else if (error.code === "auth/invalid-credential"){
        errorMessage = "Wrong email or password. Please try again."
    }
    else if(error.code === "auth/user-not-found"){
        errorMessage = "No account associated with this email address."
    }
    else {
        errorMessage = "An error occurred. Please try again later.";
    }

    return errorMessage;
}


/* SIGN UP */


function isValidAccessKey(accessKey) {
    return accessKey === "mR123123" || accessKey === "hR456456" || accessKey === "uR789789";
}


function SetRole(accessKey){

    let role;

    if (accessKey === "mR123123") {
        role = "Manager";
    }
    else if (accessKey === "hR456456") {
        role = "HR";
    }
    else if (accessKey === "uR789789"){
        role = "Staff";
    }
    return role;
}


function SetSignUpError(error, email, password){

    let errorMessage;
    if (error.code === "auth/email-already-in-use") {
        errorMessage = "The email used to sign up already exists. Please use a different email.";
    }
    else if (error.code === "auth/invalid-email" || email === "") {
        errorMessage = "Please provide a valid email address."
    }
    else if (password === "") {
        errorMessage = "Please create a password."
    }
    else if(error.code === "auth/invalid-password"){
        errorMessage = "Password must be atleast 6 characters."
    }
    else {
        errorMessage = "An error occurred. Please try again later.";
    }
    return errorMessage;
}


function CheckInputs(firstName, lastName, accessKey){

    if (firstName.trim() === "" || lastName.trim() === "") {
        document.getElementById('error-message').textContent = "Enter a valid first and last name.";
        return false;
    }

    if (!accessKey) {
        document.getElementById('error-message').textContent = "Enter a valid access key.";
        return false;
    }
    return true
}


/* TIMESHEET */


function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text; 
}



export{CreateRR, renderMeals, CheckUserAuthenticated, CreateMealNotificationElements, CreateCarWashNotificationElement,
    CreateFeedbackNotificationElement, PopulateNotifications, areInputsSelected, SubmitBooking, BookCarWash,
    ChangeWindow, SetLoginError, isValidAccessKey, SetRole, SetSignUpError, truncateText, manageDate, getDayName,
    renderBookings, CheckInputs };
