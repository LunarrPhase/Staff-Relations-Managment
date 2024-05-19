import { isValidAccessKey, SetRole, SetSignUpError } from '../src/functions.js';


const hrKey = "hR456456";
const managerKey = "mR123123";
const userKey = "uR789789";


describe("Sign up functionality", () => {


    it('Returns true if access key is correct', async () => {

        expect(isValidAccessKey(hrKey)).toBe(true);
        expect(isValidAccessKey(managerKey)).toBe(true);
        expect(isValidAccessKey(userKey)).toBe(true);
    });

    it ('Returns false if access key is empty or incorrect', async () => {

        const emptyKey = "";
        const nonsenseKey = "kfjbcewibv";

        expect(isValidAccessKey(emptyKey)).toBe(false);
        expect(isValidAccessKey(nonsenseKey)).toBe(false);
    });

    it ('Sets roles based on access keys', () => {

        expect(SetRole(hrKey)).toBe("HR");
        expect(SetRole(managerKey)).toBe("Manager");
        expect(SetRole(userKey)).toBe("Staff");
    });

    it('Displays correct errors from error codes', () => {

        const email = "example@email.com";
        const password = "123456";
        const emailInUse = {code: "auth/email-already-in-use"};
        const invalidEmail = {code: "auth/invalid-email"};
        const shortPassword = {code: "auth/invalid-password"};
        const nullVal = {code: null};

        expect(SetSignUpError(emailInUse, email, password)).toBe("The email used to sign up already exists. Please use a different email.")
        expect(SetSignUpError(invalidEmail, email, password)).toBe("Please provide a valid email address.");
        expect(SetSignUpError("", "", password)).toBe("Please provide a valid email address.");
        expect(SetSignUpError("", email, "")).toBe("Please create a password.");
        expect(SetSignUpError(shortPassword, email, password)).toBe("Password must be atleast 6 characters.");
        expect(SetSignUpError(nullVal, email, password)).toBe("An error occurred. Please try again later.")
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

/*test("getAlbums function returns an array", () => {
    const data = MusicService.getAlbums();
    expect(data.constructor).toEqual(Array);
});*/


  /*it('Calls correct firebase method', async () => {

    const email = 'example@gmail.com';
    const password = '123';

    FirebaseLogin(firebase.auth, firebase.database, email, password);
    //expect(firebase.auth().signInWithEmailAndPassword).toBeCalledWith(firebase.auth, email, password);
     /// Import the login function after mocking Firebase
      
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
  });*/


  /*jest.mock('firebase/auth');

describe('Login', () => {
  it('Logs user in', async () => {
    const mockedSignIn = jest.mocked(signInWithEmailAndPassword);
    mockedSignIn.mockResolvedValue();

    const user = FirebaseLogin('email', 'password');

    expect(mockedSignIn).toHaveBeenCalledWith(undefined, 'email', 'password');
    
  });
});*/


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

