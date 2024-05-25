import { FirebaseLogin, EnsureSignOut } from "../../src/firebase_functions.js";
import { mockFunctions } from "../../mocks.js";


describe("Login Functionality", () => {

    let consoleSpy, documentSpy, windowSpy;
    const mockElement = document.createElement("style", { style: { display: "" } } );

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        documentSpy = jest.spyOn(document, "getElementById").mockReturnValue(mockElement);
        windowSpy = jest.spyOn(mockFunctions, "ChangeWindow");
    });

    afterEach(() =>{
        console.error.mockRestore();
        document.getElementById.mockRestore();
        mockFunctions.ChangeWindow.mockRestore();
    })

    it("Throws an error when the auth is invalid", async () => {
        
        await FirebaseLogin(false, "", "");
        expect(consoleSpy).toHaveBeenCalledWith("Firebase Error:", "Invalid authentication");
        expect(document.getElementById).toHaveBeenCalledTimes(3);
    });

    it("Signs in if user's details are valid and in the realtime database", async () => {

        const windowSpy = jest.spyOn(mockFunctions, "ChangeWindow");
        await FirebaseLogin(true, "anemail@email.com", "password");
        expect(windowSpy).toHaveBeenCalled();
    });

    it("Signs in if user's details are valid and in the firestore", async () => {
        await FirebaseLogin(true, "email_not@realtime.db", "password");
        expect(windowSpy).toHaveBeenCalled();
    });

    it("Throws an error if user details are invalid", async () => {

        await FirebaseLogin(true, "email_not@firestore.db", "password");
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith("Firebase Error:", "User data not found in both Realtime Database and Firestore.")
    });
});


/*describe("EnsureSignOut Functionality", () => {

    it("Signs out if there are no errors", () => {
        const mockAuth = { signOut: function(){ return } }
        EnsureSignOut(mockAuth);
    })
})*/