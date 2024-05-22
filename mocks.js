//WHERE I MOCK FIREBASE AND OTHER FUNCTIONS SO I DON'T HAVE TO DEAL WITH THEM DURING UNIT TESTS


/* MOCKING FIREBASE */


jest.mock("./src/firebaseInit.js", () => ({

    signInWithEmailAndPassword: function(auth, email, password){

        if (auth && email == "anemail@email.com"){
            const mockUser = { uid: "uid" };
            const mockUserCred = { user: mockUser };
            return mockUserCred;
        }

        else if (auth){

            if (email == "email_not@realtime.db" || email == "email_not@firestore.db"){
                const mockUser = { uid: undefined };
                const mockUserCred = { user: mockUser };
                return mockUserCred;
            }
        }
        throw "Invalid authentication";
    }
}));


jest.mock("./src/database-imports.js", () => ({

    equalTo: function(property){ 

        /*if (property == "dne@database.com"){
            return "invalidQuery";
        }*/
        return;
    },

    get: function(userRef){

        if (userRef == "validRef"){

            const mockUser = {
                role: "role",
                firstName: "firstName",
                lastName: "lastName"
            }

            const mockSnapshot = { val: function(){ return { mockUser } } }
            return mockSnapshot;
        }

        else if (userRef == "invalidRef"){ return { val: function(){ false } } }
        else if (userRef == "invalidQuery"){ return { then: function(){ throw Error("error") }}}

        else{
            const promise = new Promise((resolve) => {
                resolve(mockSnapshot);
            });
            return promise;
        }
    },

    orderByChild: function(property){
        
        if(property == 'email'){
            return "roleChangeEmail";
        }
    },

    query: function(collections, subcollection1, subcollection2){

        if (collections == "mealOrdersRef"){ return "mealOrdersRef" }
        else if (collections == "carwashRef"){ return "carwashRef" }
        else if (subcollection1 == "exists"){ return "ref" }
        else if (subcollection1 == "DNE"){ return "noRef" }
        else if (subcollection2 == "invalidQuery"){ return "invalidQuery" }
        else if (subcollection1 == "roleChangeEmail"){ return "roleChangeEmailQuery" }
        return;
    },

    ref: function(database, text){

        if (text == "users/null"){
            throw "ID not found";
        }
        
        else if (text == "users/uid"){
            return "validRef";
        }

        else if (text == "users/undefined"){
            return "invalidRef";
        }
        else return "ref";
    },

    update: async function(ref, object){ return }
}))


jest.mock("./src/firestore-imports.js", () => ({

    addDoc: function(reference, object){ return },

    collection: function(database, collections, value1, subcollection1, value2, subcollection2){

        if(subcollection1 == "daySlotBookings" && subcollection2 == "bookedSlots"){
            return "carwashBookedRef"
        }

        else if(collections ==  `users/validID/mealOrders`){
            return "mealOrdersRef";
        }

        else if(collections ==  `users/validID/carwashBookings`){
            return "carwashRef";
        }

        else if (subcollection1 == 'daySlotBookings'){
            return "carwashDateRef";
        }
        return;
    },
    //doc: function(database, collection, field){ return },
    doc: function(reference, val){ return },
    //getDoc: async function(reference){ return mockDocument },

    getDocs: async function(reference){
    
        if (reference == "ref"){

            const mockUser = {
                role: "role",
                firstName: "",
                lastName: ""
            }

            const document = { data: function(){ return { mockUser } } }
            const docs = [ document ];
            return { docs }
        }

        else if(reference == "carwashDateRef"){

            const document = { id: "id" };
            const docs = [ document ];
            return { docs: docs }
        }

        else if (reference == "carwashBookedRef" || reference == "mealOrdersRef" || reference == "carwashRef"){

            const slot = { data: function(){ return "fullOfBookings" } }
            const snapshot = [ slot ]
            return snapshot;
        }

        else if (reference == "noRef"){ return{ empty: true } }

        const set = new Set();
        return set;
    },

    //setDoc: async function(){ return },
    updateDoc: async function(){ return },
    where: function(field, regex, fieldVal){

        if (fieldVal == "email_not@realtime.db"){
            return "exists";
        }

        else if (fieldVal == "email_not@firestore.db"){
            return "DNE";
        }
        return;
    }
}));


const snapshotVal = { id: "id", role: "role" };
const mockSnapshot = {
    exists: function(){ return true },
    val: function(){
        return snapshotVal;
    }
};


/* MOCKING FIREBASE_FUNCTIONS */


jest.mock("./src/firebase_functions.js", () => ({

    //updateAvailableSlots: function(selectedDate){ return }
}))


/* MOCKING OTHER FUNCTIONS */


jest.mock("./src/functions.js", () => ({

    ChangeWindow: function(role){ return },
    getDayName: function(year, month, day){ return "Monday" },
    renderMeals: function(querySnapshot, usersList){ return },
    SetLoginError: function(error){ return "errorMesaage" }
    
}));


const mockDocument = {
    //exists: function(){ return true }
}


const mockFunctions = require('./src/functions.js');
const mockFirebaseFunctions = require('./src/firebase_functions.js');

export{ mockFunctions, mockFirebaseFunctions };

