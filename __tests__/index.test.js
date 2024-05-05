import { SetLoginError } from '../src/functions.js';


describe("Login Functionality", () => {

    it('Displays correct error message for invalid email', async () => {

        const mockError = {code: "auth/invalid-email"};
        const errorMessage = SetLoginError(mockError);
        expect(errorMessage).toBe("Please provide a valid email address.");
    });

    it('Displays correct error message for invalid credential', async () => {

        const mockError = {code: "auth/invalid-credential"};
        const errorMessage = SetLoginError(mockError);
        expect(errorMessage).toBe("Wrong email or password. Please try again.");
    });
});