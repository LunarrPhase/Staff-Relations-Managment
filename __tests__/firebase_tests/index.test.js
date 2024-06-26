import { FirebaseLogin, EnsureSignOut } from "../../src/firebase_functions.js";
import { mockFunctions } from "../../mocks.js";


describe("Login Functionality", () => {

    let consoleSpy, windowSpy;
    const mockElement = document.createElement("style", { style: { display: "" } } );

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        windowSpy = jest.spyOn(mockFunctions, "ChangeWindow");
        jest.spyOn(document, "getElementById").mockReturnValue(mockElement);
    });

    afterEach(() =>{
        console.error.mockRestore();
        document.getElementById.mockRestore();
        mockFunctions.ChangeWindow.mockRestore();
    })

    it("Throws an error when the auth is invalid and the error message element is on the document", async () => {
        
        await FirebaseLogin(false, "", "");
        expect(consoleSpy).toHaveBeenCalledWith("Firebase Error:", "Invalid authentication");
        expect(document.getElementById).toHaveBeenCalledTimes(3);
    });

    it("Throws an error when the auth is invalid and the error message element is not on the document", async () => {
        
        jest.spyOn(document, "getElementById").mockImplementation((text) => {
            if (text == "authenticating"){ return mockElement }
            else return;
        });
        
        await FirebaseLogin(false, "", "");
        expect(consoleSpy).toHaveBeenCalledWith("Firebase Error:", "Invalid authentication");
        expect(document.getElementById).toHaveBeenCalledTimes(3);
    });

    it("Signs in if user's details are valid and in the realtime database and the loading element is on the document", async () => {

        const windowSpy = jest.spyOn(mockFunctions, "ChangeWindow");
        await FirebaseLogin(true, "anemail@email.com", "password");
        expect(windowSpy).toHaveBeenCalled();
    });

    it("Signs in if user's details are valid and in the realtime database and the loading element is not on the document", async () => {

        jest.spyOn(document, "getElementById").mockImplementation((text) => { return });
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


describe("EnsureSignOut Functionality", () => {

    it("Signs out if there are no errors with the input auth", async () => {

        const mockAuth = {
            signOut: function(){
                const promise = new Promise((resolve) => {
                    resolve();
                });
                return promise;
            }
        }
        await EnsureSignOut(mockAuth);
    });

    it("Signs out if there are no errors with the input auth", async () => {

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
        const error = new Error("Promise rejected");
        const mockAuth = {
            signOut: function(){
                const promise = new Promise((resolve, reject) => {
                    reject(new Error("Promise rejected"));
                })
                return promise;
            }
        }

        await EnsureSignOut(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("Error signing out: ", error);
        console.error.mockRestore();
    });
});