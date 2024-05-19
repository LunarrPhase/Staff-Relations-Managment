function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function ChangeWindow(role){
    
    if (role === "Manager") {
        sleep(5000)
        window.location.href = 'manager-main-page.html';
    }
    else if (role === "HR") {
        sleep(5000)
        window.location.href = 'admin-main-page.html';
    }
    else {
        sleep(5000)
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


/*CAR-WASH BOOKING DATE MANAGEMENT*/
//makes sure only fridays and mondays are bookable.
function manageDate(){
    const dateInput = document.getElementById('date');
    
    dateInput.addEventListener('input', () => {
        const selectedDate = new Date(dateInput.value);
        if (selectedDate.getDay() !== 1 && selectedDate.getDay() !== 5) {
            dateInput.value = ''; 
            dateInput.setCustomValidity('Please select a Monday or Friday.');
        } else {
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

export{ChangeWindow, SetLoginError, isValidAccessKey, SetRole, SetSignUpError, truncateText ,manageDate, getDayName, sleep };






async function sendNotification(userId, message) {
    try {
        // Get the user's FCM token from the database
        const userDoc = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();
        const userToken = userData.fcmToken;

        // Construct the payload for the notification
        const payload = {
            to: userToken,
            data: {
                message: message
            },
            notification: {
                title: 'Feedback Request',
                body: message,
                click_action: 'YOUR_ACTION_URL'
            }
        };

        // Send the notification using Firebase Cloud Messaging (FCM)
        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_SERVER_KEY'
            },
            body: JSON.stringify(payload)
        });

        // Log success message if notification is sent successfully
        console.log('Notification sent successfully!');
    } catch (error) {
        // Log error if there's an issue sending the notification
        console.error('Error sending notification:', error);
    }
}

export { sendNotification };



  






