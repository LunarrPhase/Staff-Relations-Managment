/* PLEASE DON'T DELETE THIS :( */

import { ChangeWindow } from "./src/functions";


const snapshotVal = { role: "role" };
const mockSnapshot = {
    val: function(){
        return snapshotVal;
    }
};


jest.mock("./src/firebaseInit.js", () => jest.fn());


jest.mock("./src/firestore-imports.js", () => ({

    collection: function(database, collections){ return },
    getDoc: async function(ID){ return },
    getDocs: async function(ID){ return [] },
    where: function(date, regex, selectedDate){ return }
}));


jest.mock("./src/functions.js", () => ({

    renderMeals: function(querySnapshot, usersList){
        console.log("Calling renderMeals.")
    },

    ChangeWindow: function(role){
        console.log("Changing window to " + role + " page.");
    }

}))


jest.mock("./src/database-imports.js", () => ({

    ref: function(database, text){

        if (text == "users/null"){
            throw "ID not found";
        }
        return;
    },
    get: function(userRef){

        const promise = new Promise((resolve) => {
            resolve(mockSnapshot);
        });
        return promise;
    },
    query: function(collections, subcollection){ return }
}))

