import { database as realtimeDb, auth, firestore as db} from './firebaseInit.js';
import { collection, where, getDocs, query } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { SendHome } from "./firebase_functions.js"
//import {jsPDF} from "jspdf"


const makePDF = async () => {
  
    const user = auth.currentUser
    const userRef = ref(realtimeDb, 'users/' + user.uid)
    let email = null;

    try {
        const snapshot = await get(userRef)
        const userData = snapshot.val()
        email = userData.email
    }
    catch (error) {
        console.error("Error getting user email:", error)
        return;
    }

    const feedbackRef = collection(db, 'feedback');
    const querySnapshot = await getDocs(query(feedbackRef, where('recipient', '==', email)));
    const feedbackData = []

    querySnapshot.forEach((doc) => {
        if (doc.exists) {
            const data = doc.data()
            feedbackData.push(data)
        }
        else {
            feedbackData.push("No Feedback yet!");
        }
    })
    const feedbackPdf = new jsPDF()
    let axis = 10;

    feedbackData.forEach((feedback) => {
        feedbackPdf.text(`From: ${feedback.sender}`, 10, axis)
        axis += 10
        feedbackPdf.text(`Type: ${feedback.type}`, 10, axis)
        axis += 10
        feedbackPdf.text(`Message: ${feedback.message}`, 10, axis)
        axis += 15
    })

    feedbackPdf.save('feedback_report.pdf')
}

const makePDFButton = document.getElementById('makePdf');
makePDFButton.addEventListener('click', makePDF);


const generateScreenReport = document.getElementById('screenReport');

generateScreenReport.addEventListener('click', async () => {
    const user = auth.currentUser;
    const userRef = ref(realtimeDb, 'users/' + user.uid);
    let email = null;

    try {
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        email = userData.email;
    } catch (error) {
        console.error("Error getting user email:", error);
        return;
    }

    const feedbackRef = collection(db, 'feedback');
    const querySnapshot = await getDocs(query(feedbackRef, where('recipient', '==', email)));

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
});



const homebtn = document.getElementById('home');

//home button functionality
homebtn.addEventListener('click', async () => {

    //getting current user
    const user = auth.currentUser;
    SendHome(user);
    
})