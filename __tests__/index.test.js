const test = require('firebase-functions-test')({
    databaseURL: 'https://staff-relations-management.firebaseio.com',
    storageBucket: 'staff-relations-management.appspot.com',
    projectId: 'staff-relations-management',
},'.\staff-relations-management-firebase-adminsdk-3mdbj-5ad4c10a82.json');

const admin = require('firebase-admin');


describe('testing basic function',() =>{

    let index, adminStub;
    beforeAll(() =>{
        adminStub = jest.spyOn(admin, 'initializeApp');
        index = require('../app');
        return;
    });

    afterAll(() =>{
        adminStub.mockRestore();
        test.cleanup();
    });

    it('test function returns 6',() =>{
        expect(index.basicTest()).toBe(6);
    });
});