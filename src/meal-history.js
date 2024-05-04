import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";


//makes sure code loads in time

document.addEventListener("DOMContentLoaded", function() {

 

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

    const db = getFirestore(app);
    const realtimeDb = getDatabase(app);

//get current user

    onAuthStateChanged(auth, async (user) => {



       const homebtn = document.getElementById('home');

//home button functionality

homebtn.addEventListener('click', async () => {

  //getting current user

  const user = auth.currentUser;

  console.log("clicked!")



  if (user) {

    try {

      

      const userRef = ref(realtimeDb, 'users/' + user.uid)



      get(userRef).then((snapshot) => {

        const userData = snapshot.val();

        const role = userData.role;

        if (role === "Manager") {

          window.location.href = 'manager-main-page.html'

        } else if (role === "HR") {

          window.location.href = 'admin-main-page.html'

        } else {

          window.location.href = 'main-page.html'



        }

      });

    } catch (error) {

      console.error("Error getting user role:", error)

    }



  } else {

    window.location.href = 'index.html'

  }

})



//back button to all reports

const backbtn = document.getElementById('back-btn');

backbtn.addEventListener("click", function() {

    // Navigate the user to a new HTML page

    window.location.href = "all-reports.html";

});









     

    //code for meal order history report



 
    // <a href="#"><button id="GenerateByDiet">Generate Meal history by Diet</button></a>

    // <a href="#"><button id="GenerateByDate">Generate Meal history by Date</button></a>
    


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
        } catch (error) {
            console.error("Error fetching and sorting meal orders: ", error);
        }
    })();
});




    


    //get meals by date
     
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
            } catch (error) {
                console.error("Error fetching and sorting meal orders: ", error);
            }
        })();
    });
    






//truncate long text to fit it in the table
   function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
































    // <a href="#"><button id="GeneratePDF">Generate PDF</button></a>

    // <a href="#"><button id="GenerateCSV">Generate CSV</button></a>



    //generateing pdf and csv of current display
    
    
    

    // const GeneratePDF = document.getElementById('GeneratePDF');

    // GeneratePDF.addEventListener("click", function() {
    
    // (async () => {
	   //  try {
  
	    
    //     const user = auth.currentUser;
    //     if (!user) {
    //         console.error("User not authenticated");
    //         return;
    //     }

    //     const userId = user.uid;
    //     if (!userId) {
    //         console.error("User ID not available");
    //         return;
    //     }

    //     const timesheetsRef = collection(db, `users/${userId}/timesheets`);
    //     const querySnapshot = await getDocs(timesheetsRef);

    //     const timesheetsByProject = {};

    //     querySnapshot.forEach((doc) => {
    //         const timesheetData = doc.data();
    //         const projectCode = timesheetData.projectCode;

    //         if (!timesheetsByProject[projectCode]) {
    //             timesheetsByProject[projectCode] = [];
    //         }

    //         timesheetsByProject[projectCode].push(timesheetData);
    //     });
        
        
        








    //     // Generate PDF from timesheetsByProject
    //     const doc = new jsPDF();

    //     let yOffset = 10;
    //     for (const projectCode in timesheetsByProject) {
    //         doc.setFontSize(16);
    //         doc.text(`Project: ${projectCode}`, 10, yOffset);

    //         const table = [];
    //         timesheetsByProject[projectCode].forEach(timesheetData => {
    //             table.push([
    //                 timesheetData.date,
    //                 timesheetData.startTime,
    //                 timesheetData.endTime,
    //                 timesheetData.taskName,
    //                 timesheetData.taskDescription,
    //                 timesheetData.totalHours
    //             ]);
    //         });

    //         doc.autoTable({
    //             startY: yOffset + 10,
    //             head: [['Date', 'Start Time', 'End Time', 'Task Name', 'Task Description', 'Total Hours']],
    //             body: table
    //         });

    //         yOffset = doc.autoTable.previous.finalY + 20;
    //     }

    //     doc.save('timesheets.pdf');
    //     console.log("PDF generated successfully");
    // } catch (error) {
    //     console.error("Error generating PDF: ", error);
    // }
    
    
    // })();

    // });



    // const GenerateCSV = document.getElementById('GenerateCSV');

    // GenerateCSV.addEventListener("click", function() {
    
    //  (async () => {
    //     try {
    //         const user = auth.currentUser;
    //         if (!user) {
    //             console.error("User not authenticated");
    //             return;
    //         }

    //         const userId = user.uid;
    //         if (!userId) {
    //             console.error("User ID not available");
    //             return;
    //         }

    //         const timesheetsRef = collection(db, `users/${userId}/timesheets`);
    //         const querySnapshot = await getDocs(timesheetsRef);

    //         const allTimesheets = [];

    //         querySnapshot.forEach((doc) => {
    //             const timesheetData = doc.data();
    //             allTimesheets.push(timesheetData);
    //         });

    //         // Generate CSV file with all timesheets
    //         const csvData = allTimesheets.map(timesheetData => {
    //             return [
    //                 timesheetData.date,
    //                 timesheetData.startTime,
    //                 timesheetData.endTime,
    //                 timesheetData.projectCode,
    //                 timesheetData.taskName,
    //                 timesheetData.taskDescription,
    //                 timesheetData.totalHours
    //             ].join(',');
    //         }).join('\n');

    //         // Download CSV file
    //         downloadCSV(csvData, `all_timesheets.csv`);

    //         console.log("CSV file generated successfully");
    //     } catch (error) {
    //         console.error("Error generating CSV file: ", error);
    //     }
    // })();
    
    
    

	//end csv generation

    //});
    
//     function downloadCSV(csvData, filename) {
    
//     const blob = new Blob([csvData], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
// }
    
    



    

    });

});



  

  

  

  

  
