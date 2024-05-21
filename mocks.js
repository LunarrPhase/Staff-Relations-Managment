//WHERE I MOCK FIREBASE AND OTHER FUNCTIONS SO I DON'T HAVE TO DEAL WITH THEM DURING UNIT TESTS

import { signInWithEmailAndPassword } from './src/firebaseInit.js';
import { updateAvailableSlots } from './src/firebase_functions.js';


/* MOCKING FIREBASE */


jest.mock("./src/firebaseInit.js", () => ({

    signInWithEmailAndPassword: function(auth, email, password){

        if (auth && email == "anemail@email.com"){
            const mockUser = { uid: "uid" };
            const mockUserCred = { user: mockUser };
            return mockUserCred;
        }

        else if (auth && email == "email_not@realtime.db"){
            const mockUser = { uid: undefined };
            const mockUserCred = { user: mockUser };
            return mockUserCred;
        }

        else if (auth && email == "email_not@firestore.db"){
            const mockUser = { uid: undefined };
            const mockUserCred = { user: mockUser };
            return mockUserCred;
        }
        throw "Invalid authentication";
    }
}));


jest.mock("./src/database-imports.js", () => ({

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
    },
    get: function(userRef){

        if (userRef == "validRef"){

            const mockUser = {
                role: "role",
                firstName: "",
                lastName: ""
            }
            const mockSnapshot = {
                val: function(){ return { mockUser } }
            }
            return mockSnapshot;
        }

        else if (userRef == "invalidRef"){
            return { val: function(){ false } }
        }

        const promise = new Promise((resolve) => {
            resolve(mockSnapshot);
        });
        return promise;
    },
    query: function(collections, subcollection){

        if (subcollection){ return true }
        else if (subcollection == "DNE"){ return "noRef" }
        return;
    },
    update: async function(ref, object){ return }
}))


jest.mock("./src/firestore-imports.js", () => ({

    addDoc: function(reference, object){ return },
    collection: function(database, collections){ return },
    doc: function(database, collection, field){ return },
    doc: function(reference, val){ return },
    getDoc: async function(reference){ return mockDocument },

    getDocs: async function(reference){

        if (reference){

            const mockUser = {
                role: "role",
                firstName: "",
                lastName: ""
            }
            const document = {
                data: function(){ return { mockUser } }
            }
            const docs = [ document ];
            return { docs }
        }

        else if (reference == "NoRef"){ return {} }

        const set = new Set();
        return set;
    },

    setDoc: async function(){ return },
    updateDoc: async function(){ return },
    where: function(field, regex, fieldVal){

        if (fieldVal == "email_not@realtime.db"){
            return true;
        }

        if (fieldVal == "email_not@firestore.db"){
            return "DNE";
        }
        return;
    }
}));


const snapshotVal = { role: "role" };
const mockSnapshot = {
    val: function(){
        return snapshotVal;
    }
};


/* MOCKING FIREBASE_FUNCTIONS */


jest.mock("./src/firebase_functions.js", () => ({

    updateAvailableSlots: function(selectedDate){ return }
}))


/* MOCKING OTHER FUNCTIONS */


jest.mock("./src/functions.js", () => ({

    ChangeWindow: function(role){ return },
    getDayName: function(year, month, day){ return "Monday" },
    renderMeals: function(querySnapshot, usersList){ return },
    SetLoginError: function(error){ return "errorMesaage" }
    
}));


const mockDocument = {
    exists: function(){ return true }
}


const mockFunctions = require('./src/functions.js');
const mockFirebaseFunctions = require('./src/firebase_functions.js');

export{ mockFunctions, mockFirebaseFunctions };

