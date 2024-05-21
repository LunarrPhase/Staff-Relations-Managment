import { FirebaseLogin } from "../../src/firebase_functions.js";
import { mockFunctions } from "../../mocks.js";
import { ChangeWindow } from "../../src/functions.js";


describe("Login Functionality", () => {

    it("Throws an error when the auth is invalid", async () => {

        const consoleSpy = jest.spyOn(console, "error");
        const documentSpy = jest.spyOn(document, "getElementById");
        
        let mockElement;
        mockElement = document.createElement("style", { style: { display: "" } } );
        documentSpy.mockReturnValue(mockElement);

        /*document.getElementById = jest.fn().mockImplementation((text) => {

            if (text == "authenticating"){
                const object = { style: { display: "" } };
                return object;
            }
            else { return { textContent: "" } };
        })*/

        await FirebaseLogin(false, null, null, "", "");

        expect(consoleSpy).toHaveBeenCalledWith("Firebase Error:", "Invalid authentication");
        expect(document.getElementById).toHaveBeenCalledTimes(3);
    });

    it("Signs in", async () => {

        const spy = jest.spyOn(mockFunctions, "ChangeWindow");
        await FirebaseLogin(true, "database", "db", "anemail@email.com", "password");
        expect(spy).toHaveBeenCalled();
    })
});