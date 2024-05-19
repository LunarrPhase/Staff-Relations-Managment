import { database as realtimeDb, auth, firestore as db } from './firebaseInit.js';
import { collection, getDocs, doc , addDoc} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { ChangeWindow } from './functions.js';


document.addEventListener('DOMContentLoaded', function() {
    auth.onAuthStateChanged(user => {
        if (user) {

            const goHome = document.getElementById('home');

            goHome.addEventListener('click', async () => {

                //getting current user
                const user = auth.currentUser;
               

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

            const submit = document.getElementById('submit-btn');
            const dietSelect = document.getElementById('diet');
            const mealSelect = document.getElementById('meal');
            const dateInput = document.getElementById('date');

            // Function to check if both date and diet are selected
            function areInputsSelected() {
                return dateInput.value !== "" && dietSelect.value !== "";
            }

            // Populate meals dropdown based on selected date and diet
            async function populateMeals() {
                if (areInputsSelected()) {
                    const selectedDate = dateInput.value;
                    const selectedDiet = dietSelect.value;
                    const mealOptionsRef = doc(db, 'mealOptions', selectedDate);
                    
                    const mealOptionsSnapshot = await getDocs(collection(mealOptionsRef, 'meals'));
                    //console.log(mealOptionsSnapshot);
                    
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
            }
    
            // Add event listeners
            dietSelect.addEventListener('change', populateMeals);
            dateInput.addEventListener('change', populateMeals);
            

            if (submit) {
                submit.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if (areInputsSelected()) {

                        const name = document.getElementById('name').value;                        
                        const selectedDate = dateInput.value;

                        const currentDate = new Date();
            const currentDateString = currentDate.toISOString().split('T')[0];



                        if(selectedDate > currentDateString){

                        
                        const selectedDiet = dietSelect.value;
                        const selectedMeal = mealSelect.value;

                        const userId = user.uid;
                     
                        const userMealOrdersRef = collection(db, `users/${userId}/mealOrders`);
                        const userEmail = user.email;

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


                        document.querySelector('.mealForm').reset();
                        alert("Successfully booked meal!");

                    }
                    else{
                        const warning = document.getElementById("warning");
                        warning.innerText= "Cannot book meals for current and previous days."
                    }
                    }
                    else {
                        const warning = document.getElementById("warning");
                        warning.innerText="Please select both date and diet.";
                    }
                });
            }
            console.log("User is signed in");
        }
        else {
            // No user is signed in
            console.log("No user is signed in.");
        }
    });
});
