import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import { ref, update, get, query, orderByChild, equalTo, remove} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"
import { doc, updateDoc, collection, where, addDoc, getDoc, getDocs, setDoc, deleteDoc, query as firestoreQuery} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js"
import { database, firestore as db } from "./firebaseInit.js";
import { renderMeals, ChangeWindow, SetLoginError, getDayName, areInputsSelected, CreateFeedbackNotificationElement} from "./functions.js";


/* ALL MEAL BOOKINGS */


//access firebase, then document for the day...
async function displayBookings(selectedDate) {
   
    const bookingsRef = collection(db, 'mealOrders')
    const querySnapshot = await getDocs(query(bookingsRef, where('date', '==', selectedDate)))
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
            const userRef = ref(database, 'users/' + user.uid)
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
        console.log("getting date");
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
        
        console.log("Feedback notifications:");

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
    //debugging
    //console.log(`Booked Slots for ${hour}: ${bookedSlotsSnapshot.size}`)
    return bookedSlotsSnapshot.size < 5;
}


  
async function updateAvailableSlots(selectedDay) {

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const selectedDate = new Date(selectedDay);
    const dayName = daysOfWeek[selectedDate.getDay()]

    const bookingRef = doc(db, 'carWashBookings', `${selectedDay}-${dayName}`)
    // const bookingsSnapshot = await getDocs(collection(bookingRef, 'daySlotBookings'));

    const timeSlots = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM']

    timeSlots.forEach(async (slot) => {

        const bookedSlotsRef = collection(bookingRef, 'daySlotBookings', slot, 'bookedSlots')
        const bookedSlotsSnapshot = await getDocs(bookedSlotsRef)
        const availableSlots = 5 - bookedSlotsSnapshot.size;
        //console.log(`Available slots for ${slot}: ${availableSlots}`)
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
        updateAvailableSlots(selectedDay)
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

    if(selectedDay >= currentDateString){

        //bookSlot(8AM)
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

        //to view all car wash bookings easier you can create another collection that will store all bookings
        //ever made then you can either view all, or view all by a selectable date.
        /*const carwashCollectionRef = collection(db, 'carWashOrders')
        await addDoc(carwashCollectionRef, {
            name: name,
            email: userEmail,
            date: selectedDay,
            type: selectedType,
            slot: selectedSlot
        })*/

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
    //console.log("hii");
    const selectedDate = dateInput.value;
    const selectedDiet = dietSelect.value;
    const mealOptionsRef = doc(db, 'mealOptions', selectedDate);
    
    const mealOptionsSnapshot = await getDocs(collection(mealOptionsRef, 'meals'));


    mealSelect.innerHTML = '';

    mealOptionsSnapshot.forEach((mealDoc) => {
        const mealData = mealDoc.data();

        if (mealData.diet === selectedDiet) {
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
        warning.innerText="Please select both date and diet.";
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
        console.log(dateDocRef);

        await addDoc(dateColRef, {
          diet: dietInput,
          meal: mealInput,
        });

        //clears the form and error upon submission and alerts user that meal has been booked
        document.querySelector('.add').reset();  
        alert("Successfully created meal!");
        const warning = document.getElementById("warning");
        warning.innerText= "";
    }
    else{

      //if the person selects a day that has passed, they get a warning
      const warning = document.getElementById("warning");
      warning.innerText= "Cannot book meals for current and previous days."
    }
}


/* INDEX */

async function FirebaseLogin(auth, database, db, email, password) {
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
        } else {
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
            } else {
                throw new Error("User data not found in both Realtime Database and Firestore.");
            }
        }
        ChangeWindow(role);
    } catch (error) {
        console.error("Firebase Error:", error);
        document.getElementById("authenticating").style.display = "none";
        const errorMessage = SetLoginError(error);
        const errorMessageElement = document.getElementById('error-message');
        if (errorMessageElement) {
            errorMessageElement.textContent = errorMessage;
        }
    } finally {
        const loadingMessageElement = document.getElementById('loading-message');
        if (loadingMessageElement) {
            loadingMessageElement.style.display = 'none';
        }
    }
}


/* MANAGE-USERS */


const usersRef = ref(database, 'users');
function handleRoleChange(target) {

    const row = target.closest('tr')
    const userEmail = row.getAttribute('data-user-email')

    const usersQuery = query(usersRef, orderByChild('email'), equalTo(userEmail))

    get(usersQuery)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const userId = Object.keys(snapshot.val())[0]
           

            document.getElementById('roleModal').style.display = 'block'

            document.querySelector('.close').addEventListener('click', () => {
                document.getElementById('roleModal').style.display = 'none'
            })

            // Save changes
            document.getElementById('updateRoleBtn').addEventListener('click', () => {
                const selectedRole = document.getElementById('roleSelect').value

                console.log(userId)
                const updateObj = {}
                updateObj['users/' + userId + '/role'] = selectedRole

                update(ref(database), updateObj)
                .then(() => {
                    console.log('Role updated successfully');
                    const roleCell = row.querySelector('.role')
                    if (roleCell) {
                        roleCell.textContent = selectedRole;
                    }
                    document.getElementById('roleModal').style.display = 'none'
                })
                .catch((error) => {
                    console.error('Error updating role:', error)
                })
            })
        }
        else {
            console.error('User not found')
        }
    })
    .catch((error) => {
        console.error('Error fetching user data:', error);
    })
}


function handleUserDelete(target) {
    const row = target.closest('tr');
    const userEmail = row.getAttribute('data-user-email');

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

function handleFeedbackRequest(target) {
    const row = target.closest('tr');
    const userEmail = row.getAttribute('data-user-email').toLowerCase();

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
                            const feedbackNotificationsRef = collection(db, 'feedbackNotifications');
                            await addDoc(feedbackNotificationsRef, {
                                requester: userEmail,
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




/* ALL CARWASH BOOKINGS */


async function getCarwashBookings(date) {

    const [year, month, day] = date.split('-')
    const dateString = `${year}-${month}-${day}`
    const dayName = getDayName(year, month, day)
    const fullDateString = `${dateString}-${dayName}`
    console.log('Querying for date:', fullDateString)

    const bookings = []
    const bookingRef = collection(db, 'carWashBookings', fullDateString, 'daySlotBookings');
    const bookingSnapshot = await getDocs(bookingRef)
    for (const bookingDoc of bookingSnapshot.docs) {
        const slotRef = collection(db, 'carWashBookings', fullDateString, 'daySlotBookings', bookingDoc.id, 'bookedSlots');
        const slotSnapshot = await getDocs(slotRef)
        slotSnapshot.forEach(slotDoc => {
            bookings.push(slotDoc.data())
        });
    }
    return bookings
}


 


export{doMealBooking, CreateMeal, populateMeals, displayBookings, displayAllBookings, SendHome, GetCurrentUserMealBookings, GetCurrentUserCarWashBookings,GetCurrentUserFeedbackNotifications, canBookSlot, updateAvailableSlots, bookSlot, doBooking, FirebaseLogin, handleRoleChange, handleUserDelete,handleFeedbackRequest, getCarwashBookings}
