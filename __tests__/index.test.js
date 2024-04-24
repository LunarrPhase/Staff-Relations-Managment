//import { FirebaseLogin } from '../src/index';
import App from '../src/functions';
import firebase from 'firebase/app';

jest.mock('firebase/app', () => {
  return {
    auth: jest.fn().mockReturnThis(),
    signInWithEmailAndPassword: jest.fn(),
  };
});

describe('61352544', () => {
  it('should pass', async () => {
    const email = 'example@gmail.com';
    const password = '123';
    await App.authenticate(email, password);
    expect(firebase.auth().signInWithEmailAndPassword).toBeCalledWith(email, password);
  });
});

/*
const { mockFirebase } = require('firestore-jest-mock');

// Create a fake Firestore with a `users` and `posts` collection
mockFirebase({
  database: {
    users: [
      { id: 'abc123', name: 'Homer Simpson' },
      { id: 'abc456', name: 'Lisa Simpson' },
    ],
    posts: [{ id: '123abc', title: 'Really cool title' }],
  },
});

const test = require('firebase-functions-test')({
    databaseURL: 'https://staff-relations-management.firebaseio.com',
    storageBucket: 'staff-relations-management.appspot.com',
    projectId: 'staff-relations-management',
},'.\staff-relations-management-firebase-adminsdk-3mdbj-5ad4c10a82.json');


const sinon = require('sinon');
const admin = require('firebase-admin');


test.mockConfig({ stripe: { key: '23wr42ewr34' }});
//adminInitStub = sinon.stub(admin, 'initializeApp');


describe("Login Functionality", () => {

    let signInWithEmailAndPasswordStub;

    beforeAll(() => {
        signInWithEmailAndPasswordStub = sinon.stub().resolves({ user: { uid: 'userUid' } });
        /*test.mockFirebase({
            auth: {
                signInWithEmailAndPassword: signInWithEmailAndPasswordStub
            }
        });*/
   /* });


    afterAll(() => {
        test.cleanup();
    });


    it('should sign in user with valid credentials', async () => {
        // Import the login function after mocking Firebase
        
        const { login } = require('../src/index.js');
        //const { login } = express.static("src/index.js");

        // Simulate user input
        const email = 'test@example.com';
        const password = 'password';

        // Simulate DOM event
        const event = {
            preventDefault: sinon.spy(),
            target: {
                elements: {
                    email: { value: email },
                    password: { value: password }
                }
            }
        };

        // Call the login function
        await login;

        // Assert that signInWithEmailAndPassword was called with the correct arguments
        expect(signInWithEmailAndPasswordStub.calledOnceWith(sinon.match.any, email, password));
        // You can add more assertions here if needed
    });





    it('should display error message for invalid email', async () => {
        // Import the login function after mocking Firebase
        const { login } = require('../app.js');

        // Stubbing document.getElementById to return a mock error message element
        //const errorMessageElement = { textContent: '' };
        //const getElementByIdStub = sinon.stub(document, 'getElementById').returns(errorMessageElement);

        // Simulate DOM event with invalid email
        const event = {
            preventDefault: sinon.spy(),
            target: {
                elements: {
                    email: { value: 'invalidEmail' },
                    password: { value: 'password' }
                }
            }
        };
       
        
        //document.getElementById('email').setAttribute("value", event.target.elements.email);
        //document.getElementById('password').setAttribute("value", event.target.elements.password);
        //const myInput = wrapper.find('email');
        //myInput.instance().value = 'some text';
        // Call the login function
        await log();
        const errorMessageElement = { textContent: '' };
        // Assert that error message element text content is updated correctly
        //expect(errorMessageElement.textContent).to.equal('Please provide a valid email address.');
        expect(errorMessageElement.textContent).toBe("auth/invalid-email");
        // Restore the stub
        getElementByIdStub.restore();
        document.getElementById('email').cleanup();
        document.getElementById('password').cleanup();
    });
});


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
*/