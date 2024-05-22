import { FirebaseLogin } from "../../src/firebase_functions.js";
import { mockFunctions } from "../../mocks.js";


describe("Login Functionality", () => {

    it("Throws an error when the auth is invalid", async () => {

        const consoleSpy = jest.spyOn(console, "error");
        const documentSpy = jest.spyOn(document, "getElementById");
        
        let mockElement;
        mockElement = document.createElement("style", { style: { display: "" } } );
        documentSpy.mockReturnValue(mockElement);

        await FirebaseLogin(false, null, null, "", "");

        expect(consoleSpy).toHaveBeenCalledWith("Firebase Error:", "Invalid authentication");
        expect(document.getElementById).toHaveBeenCalledTimes(3);
    });

    it("Signs in if user's details are valid and in the realtime database", async () => {

        const spy = jest.spyOn(mockFunctions, "ChangeWindow");
        await FirebaseLogin(true, "database", "db", "anemail@email.com", "password");
        expect(spy).toHaveBeenCalled();
    });

    it("Signs in if user's details are valid and in the firestore", async () => {

        const spy = jest.spyOn(mockFunctions, "ChangeWindow");
        await FirebaseLogin(true, "database", "db", "email_not@realtime.db", "password");
        expect(spy).toHaveBeenCalled();
    });

    it("Throws an error if user details are invalid", async () => {

        const consoleSpy = jest.spyOn(console, "error");
        //const errorArr = [Error: User data not found in both Realtime Database and Firestore.];
        await FirebaseLogin(true, "database", "db", "email_not@firestore.db", "password");

        expect(consoleSpy).toHaveBeenCalledTimes(2);
        expect(consoleSpy).toHaveBeenCalledWith("Firebase Error:", "Invalid authentication");
        //expect(consoleSpy).toHaveBeenCalledWith("Firebase Error:", errorArr);
    })
});