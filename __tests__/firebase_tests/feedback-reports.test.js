import { MakePDF, GenerateScreenReport } from "../../src/firebase_functions.js";


describe("MakePDF functionality", () => {

    it("Throws error if input user is invalid or has an invalid email", async () => {

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const mockUser = { uid: undefined }
        const error = new Error("Cannot read properties of undefined (reading 'email')", { details: "Type Error" })

        await MakePDF(mockUser);
        expect(consoleSpy).toHaveBeenCalledWith("Error getting user email:", error);
        console.error.mockRestore();
    });

    it("Puts up a window alert is input user has no reports to generate", async () => {

        const windowSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
        const mockUser = { uid: "newID" }

        await MakePDF(mockUser);
        expect(windowSpy).toHaveBeenCalledWith("No Feedback Report to generate");
        window.alert.mockRestore();
    });
});


describe("GenerateScreenreport functionality", () => {

    it("Throws error if input user is invalid or has an invalid email", async () => {

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const mockUser = { uid: undefined }
        const error = new Error("Cannot read properties of undefined (reading 'email')", { details: "Type Error" })

        await GenerateScreenReport(mockUser);
        expect(consoleSpy).toHaveBeenCalledWith("Error getting user email:", error);
        console.error.mockRestore();
    });


    it("Puts up a window alert if input user has no reports to display", async () => {

        const windowSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
        const mockUser = { uid: "newID" }

        await GenerateScreenReport(mockUser);
        expect(windowSpy).toHaveBeenCalledWith("No Feedback Report to display");
        window.alert.mockRestore();
    });

    it("", async () => {

       /* const mockUser = { uid: "uid" }
        document.getElementById = jest.fn().mockImplementation(() => {
            return{
                querySelectorAll: function(){
                    return { remove: function(){ return } }
                },
                insertRow: function(){ return { textContent: "" } }
            }
        })
        await GenerateScreenReport(mockUser);*/
    })
});