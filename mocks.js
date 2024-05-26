//WHERE I MOCK FIREBASE AND OTHER FUNCTIONS SO I DON'T HAVE TO DEAL WITH THEM DURING UNIT TESTS


/* MOCKING FIREBASE */


jest.mock("./src/firebaseInit.js", () => ({

    signInWithEmailAndPassword: function(auth, email, password){

        //THIS USER IS IN THE REALTIME DB
        if (auth && email == "anemail@email.com"){
            const mockUser = { uid: "uid" };
            const mockUserCred = { user: mockUser };
            return mockUserCred;
        }

        //THESE ARE NOT IN THE REALTIME DB BUT COULD BE IN THE FIRESTORE DB
        if (email == "email_not@realtime.db" || email == "email_not@firestore.db"){

            const mockUser = { uid: undefined };
            const mockUserCred = { user: mockUser };
            return mockUserCred;
        }
        
        throw "Invalid authentication";
    },

    createUserWithEmailAndPassword: function(auth, email, password){
        
        const promise = new Promise((resolve) => {
            resolve();
        });
        return promise;
    },

    signOut: function(){
        const promise = new Promise((resolve) => {
            resolve();
        });
        return promise;
    }
}));


jest.mock("./src/database-imports.js", () => ({

    equalTo: function(property){
        if (property == "email_not@realtime.db"){ return "invalid" }
        if (property == "error"){ return "error" }
        return
    },

    get: function(userRef){

        if (userRef == "invalidQuery"){ return mockEmptySnapshot }
        else if (userRef == "validRef"){ return mockSnapshot }
        else if (userRef == "allUsersRef"){ return mockAllSnapshot }
        else if (userRef == "invalidRef"){

            const promise = new Promise((resolve) => {
                resolve(mockFailedSnapshot);
            });
            return promise;
        }
        
        else if (userRef == "newUserRef"){
            return {
                val: function(){ return {email: "new_user@company.com"} }
            }
        }

        else if (userRef == "error"){
            const promise = new Promise((resolve, reject) => {
                reject(new Error("Promise rejected"));
            })
            return promise;
        }

        else{
            const promise = new Promise((resolve) => {
                resolve(mockSnapshot);
            });
            return promise;
        }
    },

    orderByChild: function(property){ return },

    query: function(collection, subcollection1, subcollection2){

        if (collection == "allNotifsRef"){ return "allNotifsRef" }
        else if (collection == "feedbackRef" && subcollection1 == "hasFeedback"){ return "feedbackRef"}
        else if (subcollection1 == "exists"){ return "ref" }
        else if (subcollection1 == "DNE"){ return "noRef" }
        else if (subcollection2 == "invalidQuery"){ return "invalidQuery" }
        else if (subcollection2 == "invalid"){ return "invalidRef" }
        else if (subcollection2 == "error" ){ return "error" }
        else return;
    },

    ref: function(database, text){

        if (text == "users/null"){ throw "ID not found" }
        if (text == "users/uid"){ return "validRef" }
        if (text == "users/undefined"){ return "invalidRef" }
        if (text == "users/newID"){ return "newUserRef" }
        if (text == "users"){ return "allUsersRef"}
        return "ref";
    },

    update: async function(ref, object){ return }
}))


jest.mock("./src/firestore-imports.js", () => ({

    addDoc: function(reference, object){ return },

    collection: function(database, collection, value1, subcollection1, value2, subcollection2){

        if(database == "carWashBookingsRef"){ return "carWashSlotRef" }
        if (database == "carWashBookedRef"){ return "carWashBookedRef" }
        if (collection == "meals"){ return "populateMealsRef" }
        if (collection == "users/poorNetwork/timesheets"){ throw "Network Error" }
        if (collection == "users/validID/timesheets"){ return "fetchTimesheetsRef" }
        if (collection == "users/newID/timesheets"){ return "noRef" }
        if (collection == "feedback"){ return "feedbackRef"}
        if (collection == "users/onlyCarID/carwashBookings" || collection == "feedbackNotifications"){
            return "allNotifsRef"
        }

        if(subcollection1 == "daySlotBookings"){
            if (subcollection2 == "bookedSlots"){
                return "allNotifsRef";
            }
            else return "ref"
        }
        
        let dest = collection.slice(14);

        if(dest ==  "mealOrders" || dest == "carwashBookings" || collection ==  "feedbackNotifications"){
            return "allNotifsRef";
        }
        return;
    },

    doc: function(database, collection, field){

        if (collection == "carWashBookings" && field == "1969-04-20-Sunday"){
            return "carWashBookingsRef";
        }

        if (database == "carWashSlotRef"){ return "carWashBookedRef" }
        if (collection == "08:00"){ return "slotBookingRef" }
        if (collection == "accounts" && field == "email_not@firestore.db"){ return "noRef"}
        if (collection == "users" && field == undefined){ throw "Undefined userID" }
        return;
    },

    getDoc: async function(reference){
        if (reference == "slotBookingRef" || reference == "noRef"){
            return mockFailedSnapshot
        }
        return mockDoc
    },

    getDocs: async function(reference){
    
        if (reference == "ref" ){ return { docs: mockDocs } }
        if (reference == "carWashBookedRef"){ return { size: 6 } }
        if (reference == "noRef"){ return mockEmptyDoc }
        if (reference == "populateMealsRef"){ return mockDocs }
        if (reference == "fetchTimesheetsRef"){ return mockDocs }
        if (reference == "allNotifsRef"){ return mockDocs }
        if (reference == "feedbackRef"){ return mockDocs }
        const set = new Set();
        return set;
    },

    setDoc: async function(){ return },
    updateDoc: async function(){ return },
    where: function(field, regex, fieldVal){

        if (fieldVal == "email_not@realtime.db"){ return "exists" }
        else if (fieldVal == "email_not@firestore.db"){ return "DNE" }

        const equation = field + regex + fieldVal;
        if (equation == "requester==invalid_query@database.com"){
            throw "Querying error";
        }

        if (equation == "recipient==new_user@company.com"){
            return "DNE"
        }
        if (equation == "recipient==anemail@email.com"){
            return "hasFeedback"
        }
        return;
    }
}));


/* MOCKING OTHER FUNCTIONS */


jest.mock("./src/functions.js", () => ({

    areInputsSelected: function(dateInput, dietSelect){
        
        if (dietSelect.value == "" || dateInput.value == ""){
            return false;
        }
        return true;
    },

    CheckInputs: function(input){

        if (input == ""){
            return false;
        }
        return true;
    },

    isValidAccessKey: function(accessKey){

        if(accessKey == "valid"){
            return true;
        }
        return false;
    },

    SetSignUpError: function(){ return },
    truncateText: function(){ return "truncatedString"},
    ChangeWindow: function(role){ return },
    getDayName: function(year, month, day){ return "Monday" },
    renderMeals: function(querySnapshot, usersList){ return },
    SetLoginError: function(error){ return "errorMesaage" }
}));


global.fetch = jest.fn(() => {
    const promise = new Promise((resolve) => {
        resolve(mockSnapshot);
    });
    return promise;
  });


/* MOCKING FIREBASE OBJECTS */


const mockData = { id: "id", role: "role", email: "anemail@email.com" };

const mockDoc = {

    id: "id",
    exists: function(){ return true },
    data: function(){
        return {
            data: mockData,
            firstName: "firstName",
            lastName: "lastName",
            fcmToken: "token",
            diet: "diet", meal: "meal",
            taskDescription: "asdfghjkl",
            date: "date", startTime: "", endTime: "", projectCode: "", taskName: "", totalHours: ""
        };
    }
}

const mockEmptyDoc = {
    empty: true,
    forEach: function(){
        return
    }
}
const mockDocs = [ mockDoc ];

const mockSnapshot = {

    user: mockData,
    email: "anemail@email.com",
    exists: function(){ return true },
    val: function(){ return mockData }
};

const mockEmptySnapshot = {

    then: function(){ throw Error("error") }
}

const mockFailedSnapshot = {

    exists: function(){ return false },
    val: function(){ return undefined }
}

const mockAllSnapshot = {
    val: function(){ return [ mockSnapshot ]},
}


const mockFunctions = require('./src/functions.js');


export{ mockFunctions, mockDoc };

