import { firestore as db } from './firebaseInit.js';
import { collection, getDocs} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { manageDate, getDayName} from './functions.js';


const usersList = document.getElementById('usersList');


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

/*async function getAllCarwashBookings() {
    const bookings = []

    const bookingsRef = collection(db, 'carWashBookings')
    const bookingSnapshot = await getDocs(bookingsRef)
    for (const bookingDoc of bookingSnapshot.docs) {
        const daySlotBookingsRef = collection(bookingDoc.ref, 'daySlotBookings');
        const daySlotBookingsSnapshot = await getDocs(daySlotBookingsRef);

        for (const daySlotBookingDoc of daySlotBookingsSnapshot.docs) {
            const bookedSlotsRef = collection(daySlotBookingDoc.ref, 'bookedSlots');
            const bookedSlotsSnapshot = await getDocs(bookedSlotsRef);
            bookedSlotsSnapshot.forEach(slotDoc => {
                bookings.push(slotDoc.data());
            });
        }
    }
    console.log(bookings)
    return bookings;
}*/


function renderBookings(bookings) {
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


const dateInput = document.getElementById('date');
manageDate(dateInput);
getDayName()

document.getElementById('date').addEventListener('change', async () => {
    const selectedDate = document.getElementById('date').value;
    const bookings = await getCarwashBookings(selectedDate);
    renderBookings(bookings)
})
//document.getElementById('load-more').addEventListener('click', getAllCarwashBookings)

