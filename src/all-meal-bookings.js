//need to see all meal bookings made by people on a specifc day
//so if HR wants to see Monday meal bookings, they should be able to choose day and see from that day.


import { firestore as db } from './firebaseInit.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


//access firebase, then document for the day...
async function displayBookings() {

    const selectedDate = document.getElementById('day').value
    console.log(selectedDate)
    const bookingsRef = collection(db, 'mealOrders')
    const querySnapshot = await getDocs(query(bookingsRef, where('date', '==', selectedDate)))

    const usersList = document.getElementById('usersList')
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


//i made this to be able to view all users without filtering by date.
async function displayAllBookings() {

    const bookingsRef = collection(db, 'mealOrders')
    const querySnapshot = await getDocs(query(bookingsRef))

    const usersList = document.getElementById('usersList')
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


document.getElementById('day').addEventListener('change', displayBookings)
document.getElementById('load-more').addEventListener('click', displayAllBookings)
