import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, where, getDocs, query } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
//import {jsPDF} from "jspdf"
 
const firebaseConfig = {
  apiKey: "AIzaSyCdhEnmKpeusKPs3W9sQ5AqpN5D62G5BlI",
  authDomain: "staff-relations-management.firebaseapp.com",
  databaseURL: "https://staff-relations-management-default-rtdb.firebaseio.com",
  projectId: "staff-relations-management",
  storageBucket: "staff-relations-management.appspot.com",
  messagingSenderId: "5650617468",
  appId: "1:5650617468:web:4892625924b0cf6b3ee5f9",
  measurementId: "G-7J5915RDP9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const realtimeDb = getDatabase(app);
const db = getFirestore(app);

const makePDF = async () => {
  const user = auth.currentUser
  const userRef = ref(realtimeDb, 'users/' + user.uid)

  let email = null;

  try {
    const snapshot = await get(userRef)
    const userData = snapshot.val()
    email = userData.email
  } catch (error) {
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
    } else {
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

const makePDFButton = document.getElementById('makePdf')
makePDFButton.addEventListener('click', makePDF)
