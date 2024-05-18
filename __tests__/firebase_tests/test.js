

const assert = require('assert');
const firebase = require('@firebase/testing');
const myProjectId = "staff-relations-management";
const firebase_functions = require("../../src/functions")


describe("Test", () => {
    it("Tests", () => {
        assert.equal(2+2, 4);
    });

    it("Does something", async () => {
        const db = firebase.initializeTestApp({projectId: myProjectId}).firestore();
        const testDoc = db.collection("readonly").doc("testDoc");
        await firebase.assertSucceeds(testDoc.get());
    })
})