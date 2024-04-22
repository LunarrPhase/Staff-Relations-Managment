const test = require('firebase-functions-test')({
    databaseURL: 'https://staff-relations-management.firebaseio.com',
    storageBucket: 'staff-relations-management.appspot.com',
    projectId: 'staff-relations-management',
},'.\staff-relations-management-firebase-adminsdk-3mdbj-5ad4c10a82.json');


const sinon = require('sinon');
const admin = require('firebase-admin');


test.mockConfig({ stripe: { key: '23wr42ewr34' }});
adminInitStub = sinon.stub(admin, 'initializeApp');


describe("Login Functionality", () => {

    let signInWithEmailAndPasswordStub;

    beforeAll(() => {
        signInWithEmailAndPasswordStub = sinon.stub().resolves({ user: { uid: 'userUid' } });
        /*test.mockFirebase({
            auth: {
                signInWithEmailAndPassword: signInWithEmailAndPasswordStub
            }
        });*/
    });


    afterAll(() => {
        test.cleanup();
    });


    it('should sign in user with valid credentials', async () => {
        // Import the login function after mocking Firebase
        
        const { login } = require('../app.js');
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
        await login(event);

        // Assert that signInWithEmailAndPassword was called with the correct arguments
        expect(signInWithEmailAndPasswordStub.calledOnceWith(sinon.match.any, email, password)).to.be.true;
        // You can add more assertions here if needed
    });


    it('should display error message for invalid email', async () => {
        // Import the login function after mocking Firebase
        const { login } = require('../app.js');

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


    /*it('test firebase callable function', () =>{
        const data = {
                text : 'not this shit again'
            };
        const context = {
                auth: {
                    uid: 'string',
                        token: {
                            aud: "firebaseproject-id",
                            auth_time: Date.now(),
                            exp: Date.now() + 1000000000,
                            firebase: {
                                identities: {
                                    user: {}
                                },
                                sign_in_provider: "password",
                            },
                        uid: "test-user"
                    }
                }
            };
            const message = index.addMessage(data, context);
            expect(message.text).toBe('not this **** again');
        });*/
});