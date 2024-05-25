import { isValidAccessKey, SetRole, SetSignUpError, CheckInputs } from '../src/functions.js';


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


describe("CheckInputs Functionality", () => {

    it("Returns true when inputs are not empty", () => {

        const mockObject = { trim: function(){ return "value" } };
        const bool = CheckInputs(mockObject, mockObject, "accessKey");
        expect(bool).toBe(true);
    });

    it("Returns false when first and lastname inputs are empty", () => {

        const mockObject = { trim: function(){ return "" } };
        document.getElementById = jest.fn().mockImplementation(() => {
            return { textContent: "" }
        });

        const bool = CheckInputs(mockObject, mockObject, "accessKey");
        expect(bool).toBe(false);
    });

    it("Returns false when access key input is empty", () => {

        const mockObject = { trim: function(){ return "value" } };
        document.getElementById = jest.fn().mockImplementation(() => {
            return { textContent: "" }
        });

        const bool = CheckInputs(mockObject, mockObject, null);
        expect(bool).toBe(false);
    });
});