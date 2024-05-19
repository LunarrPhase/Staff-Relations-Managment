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

function CreateFeedbackNotificationElement(userEmailInput){
    

        const notificationElement = document.createElement('div');
        notificationElement.classList.add('notification');
        const notificationText = `Please write a feedback report to the member with the email ${userEmailInput.text}.`;
        notificationElement.innerText = notificationText;
        document.getElementById('notifications').appendChild(notificationElement);

        return notificationElement;


    
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


/* TIMESHEET */


function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text; 
}



export{renderMeals, CheckUserAuthenticated, CreateMealNotificationElements, CreateCarWashNotificationElement, CreateFeedbackNotificationElement, PopulateNotifications, areInputsSelected, ChangeWindow, SetLoginError, isValidAccessKey, SetRole, SetSignUpError, truncateText, manageDate, getDayName, renderBookings };
