/*const test = require('firebase-functions-test')();
const sinon = require('sinon');
//const { expect, default: chai } = require('chai');
const { expect, default: chai } = import("chai").then(m=>m.default);

//We are doing offline testing to not compromise user data

//Mocking config values

//If you use functions.config() in your functions code, you can mock the config values. For example, if functions/index.js contains the following code:

const functions = require('firebase-functions');
//const key = functions.config().stripe.key();

//// Mock functions config values
test.mockConfig({ stripe: { key: '23wr42ewr34' }});

//stubb it
 // If index.js calls admin.initializeApp at the top of the file,
// we need to stub it out before requiring index.js. This is because the
// functions will be executed as a part of the require process.
// Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
//adminInitStub = sinon.stub(admin, 'initializeApp');
// Now we can require index.js and save the exports inside a namespace called myFunctions.
//const myFunctions = require('.../app');

//import functions
//e.g. const myFunctions = require('../index.js');

describe("Login Functionality", () => {
    let signInWithEmailAndPasswordStub;


    before(() => {
        signInWithEmailAndPasswordStub = sinon.stub().resolves({ user: { uid: 'userUid' } });
        test.mockFirebase({
            auth: {
                signInWithEmailAndPassword: signInWithEmailAndPasswordStub
            }
        });
    });


    after(() => {
        test.cleanup();
    });


    it('should sign in user with valid credentials', async () => {
        // Import the login function after mocking Firebase
        const { login } = require('../src/index.js');

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
        await login(event);

        // Assert that signInWithEmailAndPassword was called with the correct arguments
        expect(signInWithEmailAndPasswordStub.calledOnceWith(sinon.match.any, email, password)).to.be.true;
        // You can add more assertions here if needed
    });


    it('should display error message for invalid email', async () => {
        // Import the login function after mocking Firebase
        const { login } = require('.../app.js');

        // Stubbing document.getElementById to return a mock error message element
        const errorMessageElement = { textContent: '' };
        const getElementByIdStub = sinon.stub(document, 'getElementById').returns(errorMessageElement);

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

        // Call the login function
        await login(event);

        // Assert that error message element text content is updated correctly
        expect(errorMessageElement.textContent).to.equal('Please provide a valid email address.');

        // Restore the stub
        getElementByIdStub.restore();
    });
});*/
