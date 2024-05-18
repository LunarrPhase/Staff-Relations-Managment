import assert from 'assert';
import * as firebase from '@firebase/testing'
import pkg from '../src/firebase_functions.js';
const { FirebaseLogin } = pkg;

const myProjectId = "staff-relations-management";



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