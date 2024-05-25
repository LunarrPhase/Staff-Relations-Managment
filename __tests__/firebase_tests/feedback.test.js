import { CheckEmailExists, SendFeedBack } from "../../src/firebase_functions.js";


describe("CheckEmailExists Functionality", () => {

    it ("Returns true if the given email exists in database", async () => {
        const bool = await CheckEmailExists("anemail@email.com");
        expect(bool).toBe(true);
    });

    it ("Returns false if the given email does not exist in the database", async () => {
        const bool = await CheckEmailExists("email_not@database.com");
        expect(bool).toBe(false);
    });
});


describe("SendFeedBack Functionality", () => {

    let consoleSpy, windowSpy;

    beforeEach(() => {

        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        windowSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
        document.getElementById = jest.fn().mockImplementation(() => {
            return { value: "", innerText: "" };
        });
    });
    
    afterEach(() => {

        console.error.mockRestore();
        window.alert.mockRestore();
        document.getElementById.mockRestore();
    });

    it ("Throws error if input user is invalid or has an invalid email", async () => {

        const mockUser = { uid: undefined }
        const error = new Error("Cannot read properties of undefined (reading 'email')", { details: "Type Error" })

        await SendFeedBack(mockUser);
        expect(consoleSpy).toHaveBeenCalledWith("Error getting user email:", error);
    });

    it ("Puts up alert if input user's email not in database", async () => {

        const mockUser = { uid: "newID" }
        await SendFeedBack(mockUser);
        expect(windowSpy).toHaveBeenCalledWith("The entered email does not exist.");
    });

    it ("Sends feedback if user and email are valid and no network errors occur", async () => {

        const mockUser = { uid: "validID" }
        await SendFeedBack(mockUser);
    });
})