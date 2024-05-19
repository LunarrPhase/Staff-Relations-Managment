import { SetLoginError, ChangeWindow } from '../src/functions.js';


describe("Error handling", () => {

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

    it('Displays correct error message for user DNE', () => {

        const mockError = {code: "auth/user-not-found"};
        const errorMessage = SetLoginError(mockError);
        expect(errorMessage).toBe("No account associated with this email address.");
    });

    it('Displays correct error message for undefined error', () => {

        const mockError = {code: undefined};
        const errorMessage = SetLoginError(mockError);
        expect(errorMessage).toBe("An error occurred. Please try again later.");
    })
});


describe("Change Window functionality", () => {

    const hrPage = "admin-main-page.html";
    const managerPage = "manager-main-page.html";
    const userPage = "main-page.html";

    Object.defineProperty(globalThis, "window", {
        value: { location: { href: "" } },
        writable: true,
    });

    it("Should go to HR page", function () {
        ChangeWindow("HR");
        expect(window).toEqual({location: {href: hrPage} });
    });


    it("Should go to manager page", function () {
        ChangeWindow("Manager");
        expect(window).toEqual({location: {href: managerPage} });
    });


    it("Should go to user page", function () {
        ChangeWindow("User");
        expect(window).toEqual({location: {href: userPage} });
    });
})