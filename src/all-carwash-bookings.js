import { getCarwashBookings } from './firebase_functions.js';
import { manageDate, getDayName, renderBookings } from './functions.js';


document.addEventListener("DOMContentLoaded", function(){

    const usersList = document.getElementById('usersList');
    const dateInput = document.getElementById('date');
    manageDate(dateInput);
    getDayName();


    document.getElementById('date').addEventListener('change', async () => {
        const selectedDate = document.getElementById('date').value;
        const bookings = await getCarwashBookings(selectedDate);
        renderBookings(bookings, usersList);
    });
});


//document.getElementById('load-more').addEventListener('click', getAllCarwashBookings)


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