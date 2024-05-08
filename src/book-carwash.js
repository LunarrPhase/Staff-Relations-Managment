import { database as realtimeDb, auth, firestore as db } from './firebaseInit.js';
import { collection, getDocs, doc, setDoc, addDoc} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { manageDate, ChangeWindow } from './functions.js';
import { ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";


document.addEventListener('DOMContentLoaded', function() {
    auth.onAuthStateChanged(user => {
        if (user) {
            const submit = document.getElementById('submit-btn');
            const typeCarwash = document.getElementById('carWashType');
            const timeSlot = document.getElementById('timeSlot');
            const day = document.getElementById('date');

            function areInputsSelected() {
                return day.value !== "" && typeCarwash.value !== "";
            }

            async function canBookSlot(day) {
                //carWashBookings/friday
                const bookingRef = doc(db, 'carWashBookings', `${day}`)
                const timeSlot = document.getElementById('timeSlot');
                //get daySlotBookings
                const bookingsSnapshot = await getDocs(collection(bookingRef, 'daySlotBookings'));
                const numBookings = bookingsSnapshot.size;
                return numBookings < 5;
            }

            
            async function bookSlot(hour) {
                const selectedDay = day.value;
                const name = document.getElementById('name').value;
                const selectedType = typeCarwash.value;
                const selectedSlot = timeSlot.value;
                const userEmail = user.email;
            
                if (await canBookSlot(selectedDay)) {
                    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                    const selectedDate = new Date(selectedDay)
                    const dayName = daysOfWeek[selectedDate.getDay()]
            
                    const bookingRef = doc(db, 'carWashBookings', `${selectedDay}-${dayName}`)
                    const slotBookingRef = doc(collection(bookingRef, 'daySlotBookings'), hour)
            
                    await setDoc(slotBookingRef, {
                        day: selectedDay,
                        name: name,
                        type: selectedType,
                        slot: selectedSlot,
                        email: userEmail,
                    });
                    console.log(`Slot booked for ${hour}`);
                    updateAvailableSlots(selectedDay);
                } else {
                    alert(`No available slots today for ${hour}`);
                }
            }
            
            
            async function updateAvailableSlots(selectedDay) {
                const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const selectedDate = new Date(selectedDay);
                const dayName = daysOfWeek[selectedDate.getDay()];
                //getting the day document.
                const bookingRef = doc(db, 'carWashBookings', `${selectedDay}-${dayName}`);
                //get the collection of that day, monday/daySlotBookings.
                const bookingsSnapshot = await getDocs(collection(bookingRef, 'daySlotBookings'));
                const bookedSlots = {};
                //each id in that daySlotBooking for Monday...
                bookingsSnapshot.forEach((doc) => {
                    const data = doc.data();
                    //console.log(data)
                    const {slot} = data;
                    //console.log(slot)
                    if (!bookedSlots[slot]) {
                        bookedSlots[slot] = 0;
                    }
                    bookedSlots[slot]++;
                });
            
                const timeSlots = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM'];
                timeSlots.forEach((slot) => {
                    const availableSlots = 5 - (bookedSlots[slot] ? bookedSlots[slot] : 0);
                    console.log(`Available slots for ${slot}: ${availableSlots}`);
                    const slotElement = document.getElementById(`${slot}-slots`);
                    if (slotElement) {
                        slotElement.innerText = availableSlots.toString();
                    }
                });
            }

            

            if (submit) {
                submit.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if (areInputsSelected()) {
                        const name = document.getElementById('name').value;
                        const selectedDay = day.value;
                        const selectedType = typeCarwash.value;
                        const selectedTimeSlot = timeSlot.value;

                        //bookSlot(8AM)
                        await bookSlot(selectedTimeSlot);

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

                        /*const carwashCollectionRef = collection(db, 'carWashOrders')
                        await addDoc(carwashCollectionRef, {
                            name: name,
                            email: userEmail,
                            date: selectedDay,
                            type: selectedType,
                            slot: selectedSlot
                        })*/

                        document.querySelector('.carForm').reset();
                    } else {
                        alert("Please select both date and time slot.");
                    }
                });
            }
            console.log("User is signed in:", user.uid);
        } else {
            console.log("No user is signed in.");
        }

        const goHome = document.getElementById('home');

            goHome.addEventListener('click', async () => {

                //getting current user
                const user = auth.currentUser;
                console.log("clicked!")

                if (user) {
                    try {
                        const userRef = ref(realtimeDb, 'users/' + user.uid)

                        get(userRef).then((snapshot) => {
                            
                            const userData = snapshot.val();
                            const role = userData.role;
                            ChangeWindow(role);
                        });
                    }
                    catch (error) {
                        console.error("Error getting user role:", error)
                    }
                }
                else {
                    window.location.href = 'index.html'
                }
            })
    });
});

manageDate()


