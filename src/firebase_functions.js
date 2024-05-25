import { deleteDoc, query as firestoreQuery } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"
import { database, firestore as db, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "./firebaseInit.js";
import { renderMeals, ChangeWindow, SetLoginError, getDayName, areInputsSelected, CheckInputs, isValidAccessKey, SetSignUpError, SetRole, truncateText } from "./functions.js";
import { addDoc, collection, doc, getDoc, getDocs, setDoc, updateDoc, where } from "./firestore-imports.js";
import { equalTo, get, orderByChild, ref, remove, set, query, update } from "./database-imports.js";


/* ADD TASK */


async function AddTimeSheet(auth){

    //Get input from the form
    var fullName = document.getElementById("fullName").value;
    var email = document.getElementById("email").value;
    var date = document.getElementById("date").value;
    var startTime = document.getElementById("startTime").value;
    var endTime = document.getElementById("endTime").value;
    var totalHours = document.getElementById("totalHours").value;
    
    if (totalHours.length > 4) {
        // Limit total time to  4 characters just incase a user goes crazy
        totalHours = totalHours.substring(0, 4);
    }

    var projectCode = document.getElementById("projectCode").value;
    var taskName = document.getElementById("taskName").value;
    var taskDescription = document.getElementById("taskDescription").value;

    //adds the data collected to the users timesheets in firestore
    try {
        const user = auth.currentUser;

        if (user) {
            const userId = user.uid;

            if (userId) {

                //Adding the timesheet to the user's timesheets subcollection with auto-generated ID
                const timesheetsRef = collection(db, `users/${userId}/timesheets`);

               //structure the json
                await addDoc(timesheetsRef, {
                    fullName: fullName,
                    email: email,
                    date: date,
                    startTime: startTime,
                    endTime: endTime,
                    projectCode: projectCode,
                    taskName: taskName,
                    taskDescription: taskDescription,
                    totalHours: totalHours
                });

                //takes user back to the timesheet page.
                window.location.href = "timesheet.html";
            }
            else {
                console.error("User ID not available");
            }
        }
        else {
            console.error("User not authenticated");
        }
    }
    catch (error) {
        console.error("Error adding timesheet: ", error);
    }
}


/* ALL CARWASH BOOKINGS */


async function GetCarwashBookings(date) {

    const [year, month, day] = date.split('-')
    const dateString = `${year}-${month}-${day}`
    const dayName = getDayName(year, month, day)
    const fullDateString = `${dateString}-${dayName}`

    const bookings = []
    const bookingRef = collection(db, 'carWashBookings', fullDateString, 'daySlotBookings');
    const bookingSnapshot = await getDocs(bookingRef);
    
    for (const bookingDoc of bookingSnapshot.docs) {
        const slotRef = collection(db, 'carWashBookings', fullDateString, 'daySlotBookings', bookingDoc.id, 'bookedSlots');
        const slotSnapshot = await getDocs(slotRef);
        slotSnapshot.forEach(slotDoc => {
            bookings.push(slotDoc.data())
        });
    }
    return bookings;
}


/* ALL MEAL BOOKINGS */


//access firebase, then document for the day...
async function displayBookings(selectedDate) {

    const bookingsRef = collection(db, 'mealOrders')
    const querySnapshot = await getDocs(query(bookingsRef, where('date', '==', selectedDate)));
    const usersList = document.getElementById('usersList')

    renderMeals(querySnapshot, usersList);
}


//i made this to be able to view all users without filtering by date.
async function displayAllBookings() {

    const bookingsRef = collection(db, 'mealOrders')
    const querySnapshot = await getDocs(query(bookingsRef))
    const usersList = document.getElementById('usersList');

    renderMeals(querySnapshot, usersList);
}


/* ALL NOTIFS */


async function SendHome(user){

    if (user) {
        try {
            //goes to their database in users
            const userRef = ref(database, 'users/' + user.uid);

            get(userRef).then((snapshot) => {   
                const userData = snapshot.val();
                const role = userData.role;
                
                // baisically this makes sure they go to the correct home screen
                ChangeWindow(role);
            });
        }
        catch (error) {
            console.error("Error getting user role:", error);
        }
    }
    else {
        window.location.href = 'index.html'
    }
}


async function GetCurrentUserMealBookings(user){

    //get current user id
    const userId = user.uid;

    if (!userId) {
        console.error("User ID not available");
        SendHome(user);

    }

    //get todays date and convert it to string
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format
  
    //the refrence to their meal bookings in firestore
    const mealOrdersRef = collection(db, `users/${userId}/mealOrders`);
    
    //get the meal bookings that match todays date    
    const querySnapshot = await getDocs(query(mealOrdersRef, where('date', '==', todayString)));
    
    const mealBookings = [];
    querySnapshot.forEach((doc) => {
        mealBookings.push(doc.data());
    });
    
    //return the data on todays meal bookings
    return mealBookings;
}


async function GetCurrentUserCarWashBookings(user){

    const userId = user.uid;
        
    //gry todays date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format
    
    //fetch the users car wash bookings
    const carWashBookingsRef = collection(db, `users/${userId}/carwashBookings`);
    
    //compare the datas 
    const querySnapshot = await getDocs(query(carWashBookingsRef, where('date', '==', todayString)));
    
    const carWashBookings = [];
    querySnapshot.forEach((doc) => {
        carWashBookings.push(doc.data());
    });
    return carWashBookings;
}


//get feedback notifications
async function GetCurrentUserFeedbackNotifications(userEmail) {

    if (!userEmail) {
        console.error("User email not available");
        return [];
    }

    try {

        // Reference to the feedbackNotifications collection in Firestore
        const feedbackNotificationsRef = collection(db, 'feedbackNotifications');

        // Query to get feedback notifications where recipient matches the current user's email
        const querySnapshot = await getDocs(query(feedbackNotificationsRef, where('requester', '==', userEmail)));
       
        const feedbackNotifications = [];
        querySnapshot.forEach((doc) => {
            feedbackNotifications.push(doc.data());
        });

        // Return the data on feedback notifications        
        return feedbackNotifications;

    } catch (error) {
        console.error("Error fetching feedback notifications:", error);
        return [];
    }
}


/* BOOK CARWASH */


async function canBookSlot(day, hour) {

    const dayName = new Date(day).toLocaleDateString('en-US', { weekday: 'long' })
    const bookingRef = doc(db, 'carWashBookings', `${day}-${dayName}`)
    const slotBookingRef = doc(collection(bookingRef, 'daySlotBookings'), hour)
    const bookedSlotsRef = collection(slotBookingRef, 'bookedSlots')
    const bookedSlotsSnapshot = await getDocs(bookedSlotsRef)
   
    return bookedSlotsSnapshot.size < 5;
}


  
async function updateAvailableSlots(selectedDay) {

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const selectedDate = new Date(selectedDay);
    const dayName = daysOfWeek[selectedDate.getDay()]

    const bookingRef = doc(db, 'carWashBookings', `${selectedDay}-${dayName}`)
    const timeSlots = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM']

    timeSlots.forEach(async (slot) => {

        const bookedSlotsRef = collection(bookingRef, 'daySlotBookings', slot, 'bookedSlots')
        const bookedSlotsSnapshot = await getDocs(bookedSlotsRef)
        const availableSlots = 5 - bookedSlotsSnapshot.size;
        const slotElement = document.getElementById(`${slot}-slots`)

        if (slotElement) {
            slotElement.innerText = availableSlots.toString();
        }
    });
}


async function bookSlot(hour, selectedDay, selectedType, user) {

    const name = document.getElementById('name').value;
    const userEmail = user.email;

    if (await canBookSlot(selectedDay, hour)){
        
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const selectedDate = new Date(selectedDay)
        const dayName = daysOfWeek[selectedDate.getDay()]
        
        const bookingRef = doc(db, 'carWashBookings', `${selectedDay}-${dayName}`);
        const slotBookingRef = doc(collection(bookingRef, 'daySlotBookings'), hour);
        const bookedSlotsRef = collection(slotBookingRef, 'bookedSlots');
        const slotSnapshot = await getDoc(slotBookingRef);

        if (!slotSnapshot.exists()) {
            await setDoc(slotBookingRef, {})
        }

        await setDoc(doc(bookedSlotsRef, `${userEmail}`), {
            day: selectedDay,
            name: name,
            type: selectedType,
            slot: hour,
            email: userEmail,
        });

        alert(`Successfully booked slot for ${hour}!`)
        updateAvailableSlots(selectedDay);
    }
    else {
        alert(`No available slots today for ${hour}`)
    }
}


async function doBooking(typeCarwash, timeSlot, day, user){

    const name = document.getElementById('name').value;

    const selectedDay = day.value;
    const selectedType = typeCarwash.value;
    const selectedTimeSlot = timeSlot.value;

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];

    if(selectedDay > currentDateString){

        await bookSlot(selectedTimeSlot, selectedDay, selectedType, user);

        const userId = user.uid;
        const carWashBookingsRef = collection(db, `users/${userId}/carwashBookings`)
        const userEmail = user.email;

        await addDoc(carWashBookingsRef, {
            name: name,
            email: userEmail,
            date: selectedDay,
            type: selectedType,
            slot: selectedTimeSlot
        })

        document.querySelector('.carForm').reset();
        document.getElementById("warning").innerText="";
    }
    else{
        const warning = document.getElementById("warning");
        warning.innerText= "Cannot book carwash for current and previous days."
    }
}


/* BOOK MEALS */


// Populate meals dropdown based on selected date and diet
async function populateMeals(dateInput, dietSelect, mealSelect) {
    
    const selectedDate = dateInput.value;
    const selectedDiet = dietSelect.value;
    const mealOptionsRef = doc(db, 'mealOptions', selectedDate);
    
    const mealOptionsSnapshot = await getDocs(collection(mealOptionsRef, 'meals'));
    mealSelect.innerHTML = '';
    
    mealOptionsSnapshot.forEach((mealDoc) => {
        const mealData = mealDoc.data();

        if (mealData.diet === selectedDiet) {
            console.log("yoohoo")
            const option = document.createElement('option');
            option.text = mealData.meal;
            option.value = mealData.meal;
            mealSelect.add(option);
        }
    });
}


async function doMealBooking(dateInput, dietSelect, mealSelect, user){

    if (areInputsSelected(dateInput, dietSelect)) {

        const name = document.getElementById('name').value;                        
        const selectedDate = dateInput.value;
        //gets todays date
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().split('T')[0];

        //only submits the booking to the database is the date is after today
        if(selectedDate > currentDateString){

            const selectedDiet = dietSelect.value;
            const selectedMeal = mealSelect.value;

            const userId = user.uid;
        
            const userMealOrdersRef = collection(db, `users/${userId}/mealOrders`);
            const userEmail = user.email;

            //adds meal to users collection in firestore so each user can have their meals stored for reports, etc
            await addDoc(userMealOrdersRef, {
                name: name,
                email: userEmail,
                date: selectedDate,
                diet: selectedDiet,
                meal: selectedMeal
            });

            //i added this so we could have a seperate mealOrders collections
            const mealOrdersCollectionRef = collection(db, 'mealOrders')
            await addDoc(mealOrdersCollectionRef, {
                name: name,
                email: userEmail,
                date: selectedDate,
                diet: selectedDiet,
                meal: selectedMeal
            });

            //clears the form and sends an alert that the meal has been booked successfully
            document.querySelector('.mealForm').reset();
            alert("Successfully booked meal!");
            const warning = document.getElementById("warning");
            warning.innerText= "";
        }
        
        else{

            //updates warning to let them know they selected a date that has already passed.
            const warning = document.getElementById("warning");
            warning.innerText= "Cannot book meals for current and previous days."
        }
    }
    
    //updates the warning to let them know they did not select both date and diet
    else {
        const warning = document.getElementById("warning");
        warning.innerText = "Please select both date and diet.";
    }
}


/* CREATE MEAL */


async function CreateMeal(dateInput, dietInput, mealInput){

    //current date
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];

    //only creates meals for future dates
    if(dateInput > currentDateString){
        const colRef = collection(db,'mealOptions');

        // Add a subcollection for each day
        const dateDocRef = doc(colRef, dateInput);
        const dateColRef = collection(dateDocRef, 'meals');

        await addDoc(dateColRef, {
          diet: dietInput,
          meal: mealInput,
        });

        //clears the form and error upon submission and alerts user that meal has been booked
        document.querySelector('.add').reset();  
        alert("Successfully created meal!");
        document.getElementById("warning").innerText= "";
    }
    else{

      //if the person selects a day that has passed, they get a warning
      document.getElementById("warning").innerText= "Cannot book meals for current and previous days."
    }
}


/* FEEDBACK REPORTS */


async function MakePDF(user){
    
    const userRef = ref(database, 'users/' + user.uid);
    let email = null;

    try {
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        email = userData.email;
    }
    catch (error) {
        console.error("Error getting user email:", error);
        return;
    }

    const feedbackRef = collection(db, 'feedback');
    const querySnapshot = await getDocs(query(feedbackRef, where('recipient', '==', email)));
    const feedbackData = [];

    querySnapshot.forEach((doc) => {
        if (doc.exists) {
            const data = doc.data();
            feedbackData.push(data);
        }
    });

    if (feedbackData.length === 0) {
        alert("No Feedback Report to generate");
        return;
    }

    const feedbackPdf = new jsPDF();
    let axis = 10;

    feedbackData.forEach((feedback) => {
        feedbackPdf.text(`From: ${feedback.sender}`, 10, axis);
        axis += 10;
        feedbackPdf.text(`Type: ${feedback.type}`, 10, axis);
        axis += 10;
        feedbackPdf.text(`Message: ${feedback.message}`, 10, axis);
        axis += 15;
    });

    feedbackPdf.save('feedback_report.pdf');
};


async function GenerateScreenReport(user){

    const userRef = ref(database, 'users/' + user.uid);
    let email = null;

    try {
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        email = userData.email;
    }
    catch (error) {
        console.error("Error getting user email:", error);
        return;
    }

    const feedbackRef = collection(db, 'feedback');
    const querySnapshot = await getDocs(query(feedbackRef, where('recipient', '==', email)));

    if (querySnapshot.empty) {
        alert("No Feedback Report to display");
        return;
    }

    const existingTable = document.getElementById('existingTable');

    // Clear existing rows in the table
    const rowsToRemove = Array.from(existingTable.querySelectorAll('tr:not(:first-child)'));
    rowsToRemove.forEach(row => row.remove());

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const from = data.sender;
        const type = data.type;
        const message = data.message;

        // Create a new row
        const newRow = existingTable.insertRow();

        // Insert cells into the new row
        const fromCell = newRow.insertCell();
        const typeCell = newRow.insertCell();
        const messageCell = newRow.insertCell();

        // Set the cell content
        fromCell.textContent = from;
        typeCell.textContent = type;
        messageCell.textContent = message;
    });
}


/* FEEDBACK */

async function CheckEmailExists(email){

    const usersRef = ref(database, 'users')
    const snapshot = await get(usersRef)
    const users = snapshot.val()

    for (const key in users) {
        if (users[key].email === email) {
            return true
        }
    }
    return false
}


async function SendFeedBack(user){

    const recipient = document.getElementById('recipient').value;
    const type = document.getElementById('type').value;
    const message = document.getElementById('message').value;

    const userRef = ref(database, 'users/' + user.uid);
    let email = null;

    try {
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        email = userData.email;
    }
    catch (error) {
        console.error("Error getting user email:", error);
    }

    try {
        const emailExists = await CheckEmailExists(recipient);
        
        if (!emailExists) {
            alert('The entered email does not exist.');
            return;
        }
  
        try {
            await addDoc(collection(db, 'feedback'), {
                message: message,
                recipient: recipient,
                type: type,
                sender: email 
            });

            const modal = document.getElementById('myModal');
            modal.style.display = 'block';
            const closeButton = document.getElementsByClassName('close')[0];
            
            closeButton.onclick = function() {
                modal.style.display = 'none';
            };
        }
        catch (error) {
            console.error('Error adding feedback: ', error);
        }
    }
    catch (error) {
        console.error('Error checking email existence:', error);
    }
}

/* INDEX */


function EnsureSignOut(auth){
   
    auth.signOut().then(() => {})
    .catch((error) => {
        console.error('Error signing out: ', error);
    });
}


async function FirebaseLogin(auth, email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const dt = new Date();
        const userUid = user.uid;

        let role, firstName, lastName;

        // Check if user exists in Realtime Database
        const userRef = ref(database, 'users/' + userUid);
        const snapshot = await get(userRef);
        let userData = snapshot.val();
       
        if (userData) {
            await update(userRef, { last_login: dt });
            role = userData.role || "User";
            firstName = userData.firstName || "";
            lastName = userData.lastName || "";
        }
        else {
            // Query Firestore by email to get the document ID
            const accountsQuery = query(collection(db, 'accounts'), where('email', '==', email));
            const querySnapshot = await getDocs(accountsQuery);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                userData = doc.data();
                await updateDoc(doc.ref, { last_login: dt });
                role = userData.role || "User";
                firstName = userData.firstName || "";
                lastName = userData.lastName || "";
            }
            else {
                throw "User data not found in both Realtime Database and Firestore.";
            }
        }
        ChangeWindow(role);
    }
    catch (error) {

        console.error("Firebase Error:", error);
        document.getElementById("authenticating").style.display = "none";
        const errorMessage = SetLoginError(error);
        const errorMessageElement = document.getElementById('error-message');
        if (errorMessageElement) {
            errorMessageElement.textContent = errorMessage;
        }
    }
    finally {
        const loadingMessageElement = document.getElementById('loading-message');
        if (loadingMessageElement) {
            loadingMessageElement.style.display = 'none';
        }
    }
}


/* MAIN PAGE */


async function SetGreeting(user){

    const loading = document.getElementById('loading');
    if (user) {
        try {

            const userRef = ref(database, 'users/' + user.uid);
            const snapshot = await get(userRef);
            const userData = snapshot.val();
         
            const firstName = userData.firstName || "Unknown";
            const role = userData.role || "User";
            const waveImagePath = "wave.svg";  // Ensure this path is correct

            if (role === "Manager") {
                document.getElementById('userInfo').innerHTML = `
                    Hello, ${firstName} (Manager)
                    <img src="${waveImagePath}" alt="Profile Picture" style="width:70px; height:70px;">
                `;
            }
            
            else if (role === "HR") {
                document.getElementById('userInfo').innerHTML = `
                    Hello, ${firstName} (HR) 
                    <img src="${waveImagePath}" alt="Profile Picture" style="width:70px; height:70px;">
                `;
            }
            
            else {
                document.getElementById('userInfo').innerHTML = `
                    Hello, ${firstName} (Employee)
                    <img src="${waveImagePath}" alt="Profile Picture" style="width:70px; height:70px;">
                `;
            }
            loading.style.display = 'none'
        }
        catch (error) {
            console.error("Error fetching user data:", error);
            loading.style.display = 'none';
        }
    }
    else {
        loading.style.display = 'none'
    }
}


async function LogOut(user){

    try {
        const dt = new Date();
        const userUid = user.uid;
        const email = user.email;

        
        const userRef = ref(database, 'users/' + userUid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            
            await update(userRef, {
                last_logout: dt,
            });
        }
        
        else {
            
            const accountDocRef = doc(db, 'accounts', email);
            const docSnap = await getDoc(accountDocRef);

            if (docSnap.exists()) {
                await updateDoc(accountDocRef, {
                    last_logout: dt,
                });
            }
            else {
                throw new Error("User data not found in both Realtime Database and Firestore.");
            }
        }
        await signOut(auth);
        window.location.href = 'index.html';
    }
    catch (error) {
        console.error("Logout Error:", error);
    }
}


/* MANAGE-USERS */


function handleRoleChange(target) {

    const usersRef = ref(database, 'users');
    const row = target.closest('tr')
    const userEmail = row.getAttribute('data-user-email')

    const usersQuery = query(usersRef, orderByChild('email'), equalTo(userEmail));
    
    get(usersQuery)
    .then((snapshot) => {
        if (snapshot.exists()) {

            const userId = Object.keys(snapshot.val())[0];
            document.getElementById('roleModal').style.display = 'block';
            
            document.querySelector('.close').addEventListener('click', () => {
                document.getElementById('roleModal').style.display = 'none'
            })

            // Save changes
            document.getElementById('updateRoleBtn').addEventListener('click', () => {
                const selectedRole = document.getElementById('roleSelect').value

                
                const updateObj = {}
                updateObj['users/' + userId + '/role'] = selectedRole

                update(ref(database), updateObj)
                .then(() => {
                    const roleCell = row.querySelector('.role')
                    if (roleCell) {
                        roleCell.textContent = selectedRole;
                    }
                    document.getElementById('roleModal').style.display = 'none'
                })
                .catch((error) => {
                    console.error('Error updating role:', error)
                })
            });
        }
        else {
            console.error('User not found')
        }
    })
    .catch((error) => {
        console.error('Error fetching user data:', error);
    });
}


function handleUserDelete(target) {

    const row = target.closest('tr');
    const userEmail = row.getAttribute('data-user-email');
    const usersRef = ref(database, 'users');

    const usersQuery = query(usersRef, orderByChild('email'), equalTo(userEmail));
    get(usersQuery)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userId = Object.keys(snapshot.val())[0];
               

                document.getElementById('confirmationModal').style.display = 'block';

                document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
                    try {
                        // Remove user from Realtime Database
                        await remove(ref(database, 'users/' + userId));
                        console.log('User deleted successfully from Realtime Database');

                        // Remove user from Firestore
                        const usersCollection = collection(db, 'accounts');
                        const firestoreQuerySnapshot = await getDocs(firestoreQuery(usersCollection, where('email', '==', userEmail)));
                        firestoreQuerySnapshot.forEach(async (firestoreDoc) => {
                            await deleteDoc(doc(db, 'accounts', firestoreDoc.id));
                            console.log('User deleted successfully from Firestore');
                        });

                        // Update UI
                        row.remove();
                        document.getElementById('roleModal').style.display = 'none';
                        document.getElementById('confirmationModal').style.display = 'none';
                    } catch (error) {
                        console.error('Error deleting user:', error);
                    }
                });

                document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
                    document.getElementById('confirmationModal').style.display = 'none';
                });
            } else {
                console.error('User not found');
            }
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
        });
}

//handles feedback request on manage users
function handleFeedbackRequest(target) {

    //get the selected information
    const row = target.closest('tr');
    const userEmail = row.getAttribute('data-user-email');
    const usersRef = ref(database, 'users');
    
    //this second email helps us avoid problems with case sensitivity 
    const userEmailLowerCase = row.getAttribute('data-user-email').toLowerCase();
    
    //query db
    const usersQuery = query(usersRef, orderByChild('email'), equalTo(userEmail));
    
    get(usersQuery)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userId = Object.keys(snapshot.val())[0];

                document.getElementById('feedbackModal').style.display = 'block';

                document.querySelector('.close').addEventListener('click', () => {
                    document.getElementById('feedbackModal').style.display = 'none';
                });

                document.getElementById('sendFeedbackRequestBtn').addEventListener('click', async () => {
                    const recipientEmail = document.getElementById('feedbackEmailInput').value.toLowerCase();

                    if (recipientEmail) {
                        try {
                            //adds notification to the collection feedbackNotifications
                            const feedbackNotificationsRef = collection(db, 'feedbackNotifications');
                            await addDoc(feedbackNotificationsRef, {
                                requester: userEmailLowerCase,
                                recipient: recipientEmail,
                                timestamp: new Date().toISOString(),
                            });
                            console.log('Feedback request sent successfully');
                            document.getElementById('feedbackModal').style.display = 'none';
                        } catch (error) {
                            console.error('Error sending feedback request:', error);
                        }
                    } else {
                        console.error('Recipient email is required');
                    }
                });
            } else {
                console.error('User not found');
            }
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
        });
}


function HandleEvent(event){
    
    const target = event.target
        
    if (target.classList.contains('fa-circle-plus')) {
        handleRoleChange(target)
    }
    
    if (target.classList.contains('fa-user-xmark')) {
        handleUserDelete(target)
    }
    if (target.classList.contains('fa-bell')) {
        handleFeedbackRequest(target)
    }
}


function LoadUsers(filter){

    const usersRef = ref(database, 'users');

    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            let users = [];

            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                if (user.firstName && user.lastName && user.role) {
                    users.push(user);
                }
            });

            //filters users based on the provided filter
            if (filter) {
                const filterLower = filter.toLowerCase();
                users = users.filter(user =>
                    user.firstName.toLowerCase().includes(filterLower) ||
                    user.lastName.toLowerCase().includes(filterLower) ||
                    user.role.toLowerCase().includes(filterLower)
                );
            }

            users.sort((a, b) => (a.firstName > b.firstName) ? 1 : -1);

            let html = '';
            users.forEach((user) => {
                html += `
                    <tr data-user-email="${user.email}">
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td class="role">${user.role}</td>
                        <td>${user.email}</td>
                        <td>
                            <span class="fa-solid fa-user-xmark fa-fw" style="cursor: pointer;" title="Delete User Account">
                                <div id="confirmationModal" class="modal">
                                    <div class="modal-content">
                                        <p>Are you sure you want to delete this user?</p>
                                        <button id="confirmDeleteBtn">Yes</button>
                                        <button id="cancelDeleteBtn">No</button>
                                    </div>
                                </div>
                            </span>
                            <span class="fa-solid fa-circle-plus" style="cursor: pointer;" data-user-email="${user.email}" title="Change User Role">
                                <div id="roleModal" class="modal">
                                    <div class="modal-content">
                                        <p>Update User Role</p>
                                        <span class="close">&times;</span>
                                        <select id="roleSelect" class="form-select">
                                        <option selected disabled hidden>Select a role...</option>
                                        <option value="HR">HR</option>
                                        <option value="Staff">Staff</option>
                                        <option value="Manager">Manager</option>
                                        
                                        </select>
                                        <button id="updateRoleBtn">Save changes</button>
                                    </div>
                                </div>
                            </span>
                            <span class="fa-solid fa-bell" style="cursor: pointer;" data-user-email="${user.email}" title="Send feedback request"></span>
                            <div id="feedbackModal" class="modal">
                            <div class="modal-content">
                                <span class="close">&times;</span>
                                <h2>Request Feedback</h2>
                                <label for="feedbackEmailInput">Recipient Email:</label>
                                <input type="email" id="feedbackEmailInput" placeholder="Enter recipient's email">
                                <button id="sendFeedbackRequestBtn">Send Feedback Request</button>
                            </div>
                        </div>
                        </td>
                    </tr>
                `;
            });
            document.getElementById('usersList').innerHTML = html;
        }
        else {
            console.log('No data available');
        }
    })
    .catch((error) => {
        console.error(error);
    });
}


/* MEAL HISTORY */


async function GenerateCSV(auth){
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const userId = user.uid;
        if (!userId) {
            console.error("User ID not available");
            return;
        }
        // Fetch data
        const mealOrdersRef = collection(db, `users/${userId}/mealOrders`);
        const querySnapshot = await getDocs(mealOrdersRef);

        // Initialize data object for meal orders grouped by date
        const mealOrdersByDate = {};

        querySnapshot.forEach((doc) => {
            const mealOrderData = doc.data();
            const date = mealOrderData.date;
            if (!mealOrdersByDate[date]) {
                mealOrdersByDate[date] = [];
            }
            mealOrdersByDate[date].push(mealOrderData);
        });

        if (Object.keys(mealOrdersByDate).length === 0) {
            alert("No Meal History to generate");
            return;
        }

        // Generate CSV content
        let csvContent = "Date,Diet,Meal\n";
        for (const date in mealOrdersByDate) {
            mealOrdersByDate[date].forEach(mealOrder => {
                csvContent += `${date},${mealOrder.diet},${mealOrder.meal}\n`;
            });
        }

        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'meal_order_history.csv');
        document.body.appendChild(link);
        link.click();

        console.log("CSV generated successfully");
    }
    catch (error) {
        console.error("Error generating CSV: ", error);
    }
}


async function GeneratePDF(auth){

    try {
        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const userId = user.uid;
        if (!userId) {
            console.error("User ID not available");
            return;
        }
        // Reference the meal orders in the users database
        const mealOrdersRef = collection(db, `users/${userId}/mealOrders`);
        const querySnapshot = await getDocs(mealOrdersRef);
        // Initialize data object for meal orders grouped by date
        const mealOrdersByDate = {};

        querySnapshot.forEach((doc) => {
            const mealOrderData = doc.data();
            const date = mealOrderData.date;
            if (!mealOrdersByDate[date]) {
                mealOrdersByDate[date] = [];
            }
            mealOrdersByDate[date].push(mealOrderData);
        });

        if (Object.keys(mealOrdersByDate).length === 0) {
            alert("No Meal History to generate");
            return;
        }

        // Generate PDF using jsPDF
        const doc = new jsPDF();
        doc.text("Meal Order History", 10, 10);
        // Formatting
        let startY = 20;
        for (const date in mealOrdersByDate) {
            doc.text(`Date: ${date}`, 10, startY);
            const tableData = mealOrdersByDate[date].map(mealOrder => [mealOrder.diet, mealOrder.meal]);
            doc.autoTable({
                startY: startY + 10,
                head: [['Diet', 'Meal']],
                body: tableData
            });
            startY = doc.autoTable.previous.finalY + 10;
        }
        
        doc.save('meal_order_history_by_date.pdf');
        console.log("PDF generated successfully");
    }
    catch (error) {
        console.error("Error generating PDF: ", error);
    }
}


async function GenerateByDate(auth){

    try {
        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const userId = user.uid;
        if (!userId) {
            console.error("User ID not available");
            return;
        }

        const mealOrdersRef = collection(db, `users/${userId}/mealOrders`);
        const querySnapshot = await getDocs(mealOrdersRef);
        const mealOrdersByDate = {};

        querySnapshot.forEach((doc) => {
            const mealOrderData = doc.data();
            const date = mealOrderData.date;

            if (!mealOrdersByDate[date]) {
                mealOrdersByDate[date] = [];
            }
            mealOrdersByDate[date].push(mealOrderData);
        });

        if (Object.keys(mealOrdersByDate).length === 0) {
            alert("No Meal History to display");
            return;
        }

        // Display meal orders grouped by date
        const mealOrdersReport = document.getElementById("mealOrdersReport");
        mealOrdersReport.innerHTML = ""; // Clear previous content

        for (const date in mealOrdersByDate) {
            const dateHeading = `<h2>${date}</h2>`;
            const mealOrdersTableHeading = `
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Diet</th>
                            <th>Meal</th>
                        </tr>
                    </thead>
                    <tbody id="mealOrdersTable${date}">
                </table>
            `;

            mealOrdersReport.innerHTML += dateHeading + mealOrdersTableHeading;
            const mealOrdersTableBody = document.getElementById(`mealOrdersTable${date}`);

            mealOrdersByDate[date].forEach((mealOrderData) => {
                const mealOrderRow = `
                    <tr>
                        <td>${mealOrderData.date}</td>
                        <td>${mealOrderData.diet}</td>
                        <td>${mealOrderData.meal}</td>
                    </tr>
                `;
                mealOrdersTableBody.innerHTML += mealOrderRow;
            });
        }
        console.log("Meal orders retrieved and sorted by date successfully");
    }
    catch (error) {
        console.error("Error fetching and sorting meal orders: ", error);
    }
}


async function GenerateByDiet(auth){

    try {
        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const userId = user.uid;
        if (!userId) {
            console.error("User ID not available");
            return;
        }
        // Reference the users meal orders in the db firestore
        const mealOrdersRef = collection(db, `users/${userId}/mealOrders`);
        const querySnapshot = await getDocs(mealOrdersRef);
        const mealOrdersByDiet = {};

        querySnapshot.forEach((doc) => {
            const mealOrderData = doc.data();
            const diet = mealOrderData.diet;

            if (!mealOrdersByDiet[diet]) {
                mealOrdersByDiet[diet] = [];
            }

            mealOrdersByDiet[diet].push(mealOrderData);
        });

        if (Object.keys(mealOrdersByDiet).length === 0) {
            alert("No Meal History to display");
            return;
        }

        // Display meal orders grouped by diet
        const mealOrdersReport = document.getElementById("mealOrdersReport");
        mealOrdersReport.innerHTML = ""; // Clear previous content

        for (const diet in mealOrdersByDiet) {
            const dietHeading = `<h2>${diet}</h2>`;
            const mealOrdersTableHeading = `
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Diet</th>
                            <th>Meal</th>
                        </tr>
                    </thead>
                    <tbody id="mealOrdersTable${diet}">
                </table>
            `;

            mealOrdersReport.innerHTML += dietHeading + mealOrdersTableHeading;
            const mealOrdersTableBody = document.getElementById(`mealOrdersTable${diet}`);

            mealOrdersByDiet[diet].forEach((mealOrderData) => {
                const mealOrderRow = `
                    <tr>
                        <td>${mealOrderData.date}</td>
                        <td>${mealOrderData.diet}</td>
                        <td>${mealOrderData.meal}</td>
                    </tr>
                `;
                mealOrdersTableBody.innerHTML += mealOrderRow;
            });
        }
        console.log("Meal orders retrieved and sorted by diet successfully");
    }
    catch (error) {
        console.error("Error fetching and sorting meal orders: ", error);
    }
}


/* SIGN UP */


async function CreateNewAccount(auth){

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let accessKey = document.getElementById('accessKey').value;

    if (!CheckInputs(firstName, lastName, accessKey)){
        return;
    }

    if (isValidAccessKey(accessKey)) {
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                document.getElementById("signingUp").style.display = "block";
                const user = userCredential.user;
                const role = SetRole(accessKey);
                // Add user to Realtime Database
                set(ref(database, 'users/' + user.uid), {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    role: role,
                }).then(() => {
                    // Add user to Firestore 'accounts' collection
                    setDoc(doc(db, "accounts", email), {
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        role: role,
                    }).then(() => {
                        // Add the document to Realtime Database under users.
                        set(ref(database, 'users/' + user.uid), {
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            role: role,
                        }).then(() => {
                            document.getElementById("signingUp").style.display = "none";
                            document.getElementById("info").textContent = "Your account was successfully created. Go back to the sign in page and sign in.";
                            window.location.href = 'index.html';
                        }).catch((error) => {
                            document.getElementById('error-message').textContent = "Error adding document to Realtime Database 'users' node: " + error.message;
                        });
                    }).catch((error) => {
                        document.getElementById('error-message').textContent = "Error adding document to Firestore: " + error.message;
                    });
                }).catch((error) => {
                    document.getElementById('error-message').textContent = "Error adding document to Realtime Database: " + error.message;
                });
            })
            .catch((error) => {
                const errorMessage = SetSignUpError(error, email, password);
                document.getElementById('error-message').textContent = errorMessage;
            });
    }
    else {
        document.getElementById('error-message').textContent = "Invalid access key.";
    }
}


/* SINGLE NOTIF */


async function DisplaySingleNotification(auth){

    try {
        //get current user credentials
        const user = auth.currentUser;

        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const userId = user.uid;
        if (!userId) {
            console.error("User ID not available");
            return;
        }
        //get todays date
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format

        // Fetch meal bookings
        const mealOrdersRef = collection(db, `users/${userId}/mealOrders`);
        const mealQuerySnapshot = await getDocs(query(mealOrdersRef, where('date', '==', todayString)));
        const mealBookings = [];
        mealQuerySnapshot.forEach((doc) => {
            mealBookings.push(doc.data());
        });

        // Fetch car wash bookings
        const carWashBookingsRef = collection(db, `users/${userId}/carwashBookings`);
        const carWashQuerySnapshot = await getDocs(query(carWashBookingsRef, where('date', '==', todayString)));
        const carWashBookings = [];
        carWashQuerySnapshot.forEach((doc) => {
            carWashBookings.push(doc.data());
        });

        //fetch feedback requests
        const feedbackNotificationsRef = collection(db, 'feedbackNotifications');
        const querySnapshot = await getDocs(query(feedbackNotificationsRef, where('requester', '==', user.email)));

        const feedbackNotifications = [];

        querySnapshot.forEach((doc) => {
            feedbackNotifications.push(doc.data());
        });

        // Determine the notification text -> it will only display one of these in the popup
        let notificationText = "";

        if (mealBookings.length > 0) {
            const mealBooking = mealBookings[0]; // Get the first meal booking for the day
            notificationText = `Today you booked a ${mealBooking.diet} meal of: ${mealBooking.meal}.`;
        } else if (carWashBookings.length > 0) {
            const carWashBooking = carWashBookings[0]; // Get the first car wash booking for the day
            notificationText = `Today you booked a ${carWashBooking.type} car wash for the ${carWashBooking.slot} slot.`;
        }
        else{
            const feedback = feedbackNotifications[0];
            notificationText = `Please give feedback to ${feedback.recipient}.`;
        }

        // Update the popover content
        const popoverContent = document.getElementById('popover-content');
        if (notificationText) {
            popoverContent.innerHTML = `
                <h3>Notifications</h3>
                <p>${notificationText}</p>
                <a href="all-notifs.html" class="see-all-link">See all</a>
            `;
        }
    }
    catch (error) {
        console.error("Error fetching bookings: ", error);
    }  
}


/* TIMESHEET-REPORTS */


async function GetTimesheetsByProject(user){

    if (user) {
        const userId = user.uid;
        if (userId) {
            try {
                const timesheetsRef = collection(db, `users/${userId}/timesheets`);
                const querySnapshot = await getDocs(timesheetsRef);
                const timesheetsByProject = {};

                querySnapshot.forEach((doc) => {
                    const timesheetData = doc.data();
                    const projectCode = timesheetData.projectCode;

                    if (!timesheetsByProject[projectCode]) {
                        timesheetsByProject[projectCode] = [];
                    }

                    timesheetsByProject[projectCode].push(timesheetData);
                });

                if (Object.keys(timesheetsByProject).length === 0) {
                    alert("No Timesheet History to display");
                    return;
                }

                const timesheetReport = document.getElementById("timesheetReport");
                timesheetReport.innerHTML = ""; 

                for (const projectCode in timesheetsByProject) {
                    const projectHeading = `<h2>${projectCode}</h2>`;
                    const timesheetTableHeading = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Task Name</th>
                                    <th>Task Description</th>
                                    <th>Total Hours</th>
                                </tr>
                            </thead>
                            <tbody id="timesheetTable${projectCode}">
                        </table>
                    `;

                    timesheetReport.innerHTML += projectHeading + timesheetTableHeading;
                    const timesheetTableBody = document.getElementById(`timesheetTable${projectCode}`);
                    timesheetsByProject[projectCode].forEach((timesheetData) => {
                        const truncatedTaskDescription = truncateText(timesheetData.taskDescription, 20);
                        const timesheetRow = `
                            <tr>
                                <td>${timesheetData.date}</td>
                                <td>${timesheetData.startTime}</td>
                                <td>${timesheetData.endTime}</td>
                                <td>${timesheetData.taskName}</td>     
                                <td class="truncate" title="${timesheetData.taskDescription}">${truncatedTaskDescription}</td>
                                <td>${timesheetData.totalHours}</td>
                            </tr>
                        `;

                        timesheetTableBody.innerHTML += timesheetRow;
                    });
                }
                console.log("Timesheets retrieved and sorted by project successfully");
            } catch (error) {
                console.error("Error fetching and sorting timesheets: ", error);
            }
        } else {
            console.error("User ID not available");
        }
    } else {
        console.error("User not authenticated");
    }
}


async function GetTimesheetsByTask(user){

    if (user) {
        const userId = user.uid;
        if (userId) {
            try {
                const timesheetsRef = collection(db, `users/${userId}/timesheets`);
                const querySnapshot = await getDocs(timesheetsRef);
                const timesheetsByTask = {};

                querySnapshot.forEach((doc) => {
                    const timesheetData = doc.data();
                    const taskName = timesheetData.taskName;

                    if (!timesheetsByTask[taskName]) {
                        timesheetsByTask[taskName] = [];
                    }

                    timesheetsByTask[taskName].push(timesheetData);
                });

                if (Object.keys(timesheetsByTask).length === 0) {
                    alert("No Timesheet History to display");
                    return;
                }

                const timesheetReport = document.getElementById("timesheetReport");
                timesheetReport.innerHTML = ""; 

                for (const taskName in timesheetsByTask) {
                    const taskHeading = `<h2>${taskName}</h2>`;
                    const timesheetTableHeading = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Project Code</th>
                                    <th>Task Description</th>
                                    <th>Total Hours</th>
                                </tr>
                            </thead>
                            <tbody id="timesheetTable${taskName}">
                        </table>
                    `;

                    timesheetReport.innerHTML += taskHeading + timesheetTableHeading;
                    const timesheetTableBody = document.getElementById(`timesheetTable${taskName}`);
                    timesheetsByTask[taskName].forEach((timesheetData) => {
                        const truncatedTaskDescription = truncateText(timesheetData.taskDescription, 20);
                        const timesheetRow = `
                            <tr>
                                <td>${timesheetData.date}</td>
                                <td>${timesheetData.startTime}</td>
                                <td>${timesheetData.endTime}</td>
                                <td>${timesheetData.projectCode}</td>
                                <td class="truncate" title="${timesheetData.taskDescription}">${truncatedTaskDescription}</td>
                                <td>${timesheetData.totalHours}</td>
                            </tr>
                        `;

                        timesheetTableBody.innerHTML += timesheetRow;
                    });
                }
                console.log("Timesheets retrieved and sorted by task description successfully");
            } catch (error) {
                console.error("Error fetching and sorting timesheets: ", error);
            }
        } else {
            console.error("User ID not available");
        }
    } else {
        console.error("User not authenticated");
    }
}


async function GenerateTimesheetPDF(auth){
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const userId = user.uid;
        if (!userId) {
            console.error("User ID not available");
            return;
        }

        const timesheetsRef = collection(db, `users/${userId}/timesheets`);
        const querySnapshot = await getDocs(timesheetsRef);
        const timesheetsByProject = {};

        querySnapshot.forEach((doc) => {
            const timesheetData = doc.data();
            const projectCode = timesheetData.projectCode;

            if (!timesheetsByProject[projectCode]) {
                timesheetsByProject[projectCode] = [];
            }
            timesheetsByProject[projectCode].push(timesheetData);
        });

        if (Object.keys(timesheetsByProject).length === 0) {
            alert("No Timesheet History to generate PDF");
            return;
        }

        const doc = new jsPDF();
        let yOffset = 10;
        
        for (const projectCode in timesheetsByProject) {
            doc.setFontSize(16);
            doc.text(`Project: ${projectCode}`, 10, yOffset);
            const table = [];

            timesheetsByProject[projectCode].forEach(timesheetData => {
                table.push([
                    timesheetData.date,
                    timesheetData.startTime,
                    timesheetData.endTime,
                    timesheetData.taskName,
                    timesheetData.taskDescription,
                    timesheetData.totalHours
                ]);
            });

            doc.autoTable({
                startY: yOffset + 10,
                head: [['Date', 'Start Time', 'End Time', 'Task Name', 'Task Description', 'Total Hours']],
                body: table
            });

            yOffset = doc.autoTable.previous.finalY + 20;
        }
        doc.save('timesheets.pdf');
        console.log("PDF generated successfully");
    } catch (error) {
        console.error("Error generating PDF: ", error);
    }
}


async function GenerateTimesheetCSV(auth){

    try {
        const user = auth.currentUser;
        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const userId = user.uid;
        if (!userId) {
            console.error("User ID not available");
            return;
        }

        const timesheetsRef = collection(db, `users/${userId}/timesheets`);
        const querySnapshot = await getDocs(timesheetsRef);
        const allTimesheets = [];

        querySnapshot.forEach((doc) => {
            const timesheetData = doc.data();
            allTimesheets.push(timesheetData);
        });

        if (allTimesheets.length === 0) {
            alert("No Timesheet History to generate CSV");
            return;
        }

        const csvData = allTimesheets.map(timesheetData => {
            return [
                timesheetData.date,
                timesheetData.startTime,
                timesheetData.endTime,
                timesheetData.projectCode,
                timesheetData.taskName,
                timesheetData.taskDescription,
                timesheetData.totalHours
            ].join(',');
        }).join('\n');

        const csvFile = new Blob([csvData], {type: "text/csv"});
        const downloadLink = document.createElement("a");
        downloadLink.download = `timesheets.csv`;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }
    catch (error) {
        console.error("Error generating CSV file: ", error);
    }
}


/* TIMESHEET */


async function FetchTimesheets(user){

    if (user) {
        const userId = user.uid;

        if (user.uid) {
            try {
                //fetch the timesheets from the current users firestore db
                const timesheetsRef = collection(db, `users/${userId}/timesheets`);
                const querySnapshot = await getDocs(timesheetsRef);
                const timesheetsBody = document.getElementById("timeSheetBody");

                querySnapshot.forEach((doc) => {

                    // Process each timesheet document
                    const timesheetData = doc.data();
                    const truncatedTaskDescription = truncateText(timesheetData.taskDescription, 20);
                    const timesheetRow = `

                        <tr>
                            <td>${timesheetData.date}</td>
                            <td>${timesheetData.startTime}</td>
                            <td>${timesheetData.endTime}</td>
                            <td>${timesheetData.projectCode}</td>
                            <td>${timesheetData.taskName}</td>
                            <td class="truncate" title="${timesheetData.taskDescription}">${truncatedTaskDescription}</td>
                            <td>${timesheetData.totalHours}</td>
                        </tr>
                        `;
                    //add it to the html
                      timesheetsBody.innerHTML += timesheetRow;
                      
                });
                console.log("Timesheets retrieved successfully");
            }
            catch (error) {
                console.error("Error fetching timesheets: ", error);
            }
        }
        else {
            console.error("User ID not available");
        }
    }

    else {
        console.error("User not authenticated");
    }
}


export{ AddTimeSheet, doMealBooking, CreateMeal, populateMeals, displayBookings, displayAllBookings, SendHome,
    GetCurrentUserMealBookings, GetCurrentUserCarWashBookings, GetCurrentUserFeedbackNotifications, canBookSlot,
    updateAvailableSlots, bookSlot, doBooking, MakePDF, GenerateScreenReport, CheckEmailExists, SendFeedBack,
    EnsureSignOut, FirebaseLogin, SetGreeting, LogOut, handleRoleChange, handleUserDelete, handleFeedbackRequest,
    GetCarwashBookings, HandleEvent, LoadUsers, GenerateCSV, GeneratePDF, GenerateByDate, GenerateByDiet,
    CreateNewAccount, DisplaySingleNotification, FetchTimesheets, GetTimesheetsByProject, GetTimesheetsByTask,
    GenerateTimesheetPDF, GenerateTimesheetCSV }