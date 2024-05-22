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
                    const userRef = ref(realtimeDb, 'users/' + user.uid);

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

       
        //get the timesheets by project code
        const projectbtn = document.getElementById('GenerateByProject');

projectbtn.addEventListener("click", function() {
    (async () => {
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
    })();
});
const taskbtn = document.getElementById('GenerateByTask');

taskbtn.addEventListener("click", function() {
    (async () => {
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
    })();
});
const GeneratePDF = document.getElementById('GeneratePDF');

GeneratePDF.addEventListener("click", function() {
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
    })();
});
const GenerateCSV = document.getElementById('GenerateCSV');

GenerateCSV.addEventListener("click", function() {
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

            downloadCSV(csvData, `timesheets.csv`);
        } catch (error) {
            console.error("Error generating CSV file: ", error);
        }
    })();
});

function downloadCSV(csv, filename) {
    const csvFile = new Blob([csv], {type: "text/csv"});
    const downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}
    })
});
