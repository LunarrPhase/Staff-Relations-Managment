import { database as realtimeDb, auth, firestore as db } from './firebaseInit.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";


//makes sure code loads in time
document.addEventListener("DOMContentLoaded", function() {

    //get current user
    onAuthStateChanged(auth, async (user) => {
       const homebtn = document.getElementById('home');

        //home button functionality
        homebtn.addEventListener('click', async () => {

            //getting current user
            const user = auth.currentUser;
            //console.log("clicked!")

            if (user) {
                try {
                    const userRef = ref(realtimeDb, 'users/' + user.uid)

                    get(userRef).then((snapshot) => {
                        const userData = snapshot.val();
                        const role = userData.role;

                        if (role === "Manager") {
                            window.location.href = 'manager-main-page.html'
                        }
                        else if (role === "HR") {
                            window.location.href = 'admin-main-page.html'
                        }
                        else {
                            window.location.href = 'main-page.html'
                        }
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

        //back button to all reports
        const backbtn = document.getElementById('back-btn');
        backbtn.addEventListener("click", function() {

            // Navigate the user to a new HTML page
            window.location.href = "all-reports.html";
        });

   
        //get the meals by diet
        const dietbtn = document.getElementById('GenerateByDiet');
        dietbtn.addEventListener("click", function() {

            (async () => {
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
                    //reference the users meal orders in the db firestore
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
            })();
        });

        //get meals by date (so the same as earlier just by date not diet)
        const dateBtn = document.getElementById('GenerateByDate');
        dateBtn.addEventListener("click", function() {

            (async () => {
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
            })();
        });





//generate pdf for meal history

const GeneratePDF = document.getElementById('GeneratePDF');

GeneratePDF.addEventListener("click", async function() {
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
        //refrence the meal orders in the users database
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

        // Generate PDF using jsPDF
        const doc = new jsPDF();
        doc.text("Meal Order History", 10, 10);
        //formatting 
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
    } catch (error) {
        console.error("Error generating PDF: ", error);
    }
});


//generate csv
const GenerateCSV = document.getElementById('GenerateCSV');

GenerateCSV.addEventListener("click", async function() {
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
        //fetch data
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
    } catch (error) {
        console.error("Error generating CSV: ", error);
    }
});







    });

});



  

  

  

  

  
