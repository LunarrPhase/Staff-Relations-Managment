import { FirebaseLogin, SetErrorMessage, basicTest } from '../src/functions.js';
import firebase from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


/*const test = require('firebase-functions-test')({
    databaseURL: 'https://staff-relations-management.firebaseio.com',
    storageBucket: 'staff-relations-management.appspot.com',
    projectId: 'staff-relations-management',
},'.\staff-relations-management-firebase-adminsdk-3mdbj-5ad4c10a82.json');*/


const admin = require('firebase-admin');


jest.mock('firebase/auth');

describe('Login', () => {
  it('Logs user in', async () => {
    const mockedSignIn = jest.mocked(signInWithEmailAndPassword);
    mockedSignIn.mockResolvedValue();

    const user = FirebaseLogin('email', 'password');

    expect(mockedSignIn).toHaveBeenCalledWith(undefined, 'email', 'password');
    
  });
});


describe('testing basic function',() =>{

    let adminStub;
  
    beforeAll(() =>{
        adminStub = jest.spyOn(admin, 'initializeApp');
        return;
    });
  
    afterAll(() =>{
        adminStub.mockRestore();
        test.cleanup();
    });
  
    it('test function returns 6',() =>{
        expect(basicTest()).toBe(6);
    });
});

jest.mock("firebase/app", () => {
  return {
      initializeApp: jest.fn().mockReturnValue({
          database: jest.fn().mockReturnValue({
              ref: jest.fn().mockReturnThis(),
          })
      }), 
      auth: jest.fn().mockReturnValue()
  };
});


describe("Login Functionality", () => {

  beforeAll(() => {
      jest.clearAllMocks();
  });


  afterAll(() => {
     
  });


  it('Calls correct firebase method', async () => {

    const email = 'example@gmail.com';
    const password = '123';

    FirebaseLogin(firebase.auth, firebase.database, email, password);
    //expect(firebase.auth().signInWithEmailAndPassword).toBeCalledWith(firebase.auth, email, password);
     /* // Import the login function after mocking Firebase
      
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
      // You can add more assertions here if needed*/
  });





    it('Displays correct error message for invalid email', async () => {

        const Mockerror = {code: "auth/invalid-email"};
        const errorMessage = SetErrorMessage(Mockerror);
        expect(errorMessage).toBe("Please provide a valid email address.");
    });


    it('Displays correct error message for invalid credential', async () => {

        const Mockerror = {code: "auth/invalid-credential"};
        const errorMessage = SetErrorMessage(Mockerror);
        expect(errorMessage).toBe("Wrong email or password. Please try again.");
  });
});


/*jest.mock("firebase/app", () => {
    return {
        initializeApp: jest.fn().mockReturnValue({
            database: jest.fn().mockReturnValue({
                ref: jest.fn().mockReturnThis(),
            })
        }), 
        auth: jest.fn().mockReturnValue()
    };
});*/

/*test("getAlbums function returns an array", () => {
    const data = MusicService.getAlbums();
    expect(data.constructor).toEqual(Array);
});*/