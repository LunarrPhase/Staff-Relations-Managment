import { CreateNewAccount } from "../../src/firebase_functions";
import { mockFunctions } from "../../mocks"


describe("CreateNewAccount functionality", () => {

    it("Does nothing if CheckInputs returns false", async () => {

        const functionSpy = jest.spyOn(mockFunctions, "CheckInputs")
        const documentSpy = jest.spyOn(document, "getElementById").mockImplementation(() => {
            return { value: "" }
        });

        await CreateNewAccount(null);
        expect(documentSpy).toHaveBeenCalledTimes(5);
        expect(functionSpy).toHaveBeenCalled();

        document.getElementById.mockRestore();
        mockFunctions.CheckInputs.mockRestore();
    });

    it("Does nothing if access key is not valid", async () => {

        const functionSpy = jest.spyOn(mockFunctions, "isValidAccessKey");
        const documentSpy = jest.spyOn(document, "getElementById").mockImplementation(() => {
            return { value: "invalid", textContent: "" }
        });
        
        await CreateNewAccount(null);
        expect(documentSpy).toHaveBeenCalledTimes(6);
        expect(functionSpy).toHaveBeenCalled();

        document.getElementById.mockRestore();
        mockFunctions.isValidAccessKey.mockRestore();
    });

    it("Calls SetSignUp error if createUserWithEmailAndPassword throws an error", async () => {

        const functionSpy = jest.spyOn(mockFunctions, "SetSignUpError");
        document.getElementById = jest.fn().mockImplementation(() => {
            return {
                value: "valid",
                textContent: "",
                style: { display: "" }
            }
        });
        
        await CreateNewAccount(null);

        expect(functionSpy).toHaveBeenCalled();
        document.getElementById.mockRestore();
        mockFunctions.SetSignUpError.mockRestore();
    })
})