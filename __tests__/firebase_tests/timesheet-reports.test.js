import { mockFunctions } from "../../mocks";
import { GenerateTimesheetCSV, GenerateTimesheetPDF, GetTimesheetsByTask, GetTimesheetsByProject } from "../../src/firebase_functions";


describe("GenerateTimesheetCSV", () => {

    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error")
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it("Throws an error if the input auth is invalid", async () => {

        const error = new Error("Cannot read properties of null (reading 'currentUser')", { details: "Type Error" })
        await GenerateTimesheetCSV(null);
        expect(consoleSpy).toHaveBeenCalledWith("Error generating CSV file: ", error)
    })

    it("Throws an error if the input auth has an invalid user property", async () => {

        const mockAuth = { currentUser: null}
        await GenerateTimesheetCSV(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("User not authenticated");
    });

    it("Throws an error if the input auth has an valid user property with an invalid ID", async () => {

        const mockAuth = { currentUser: { uid: null } };
        await GenerateTimesheetCSV(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("User ID not available");
    });

    it("Throws an error if the input auth has an valid user property with an invalid ID", async () => {

        const mockAuth = { currentUser: { uid: "validID" } };
        const documentSpy = jest.spyOn(document.body, 'appendChild');
        const mockDownloadLink = {
            download: "",
            href: "",
            style: { display: "" },
            click: function(){ return }
        };

        document.createElement = jest.fn().mockImplementation(() => { return mockDownloadLink });
        window.URL.createObjectURL = jest.fn().mockImplementation(() => { return "url" })
        await GenerateTimesheetCSV(mockAuth);

        expect(documentSpy).toHaveBeenCalled();
        window.URL.createObjectURL.mockRestore();
        document.createElement.mockRestore();
    });
});


describe("GenerateTimesheetPDF", () => {

    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => jest.fn());
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it("Throws an error if the input auth is invalid", async () => {

        const error = new Error("Cannot read properties of null (reading 'currentUser')")
        await GenerateTimesheetPDF(null);
        expect(consoleSpy).toHaveBeenCalledWith("Error generating PDF: ", error)
    })

    it("Throws an error if the input auth has an invalid user property", async () => {

        const mockAuth = { currentUser: null}
        await GenerateTimesheetPDF(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("User not authenticated");
    });

    it("Throws an error if the input auth has an valid user property with an invalid ID", async () => {

        const mockAuth = { currentUser: { uid: null } };
        await GenerateTimesheetPDF(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("User ID not available");
    });
});


describe("GetTimesheetsByTask Functionality", () => {

    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => jest.fn());
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it("Throws an error if the input user is invalid", async () => {
        await GetTimesheetsByTask(null);
        expect(consoleSpy).toHaveBeenCalledWith("User not authenticated");
    });

    it("Throws an error if user is valid but has an invalid ID", async () => {

        const mockUser = { uid: null };
        await GetTimesheetsByTask(mockUser);
        expect(consoleSpy).toHaveBeenCalledWith("User ID not available");
    });

    it("Retrieves timesheets by task when user and uid is valid", async () => {

        const mockUser = { uid: "validID" }

        const functionSpy = jest.spyOn(mockFunctions, "truncateText");
        document.getElementById = jest.fn().mockImplementation(() => {
            return { innerHTML: "" }
        });
        await GetTimesheetsByTask(mockUser);

        expect(functionSpy).toHaveBeenCalled();
        document.getElementById.mockRestore();
        mockFunctions.truncateText.mockRestore();
    })
})


describe("GetTimesheetsByProject Functionality", () => {

    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => jest.fn());
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it("Throws an error if the input user is invalid", async () => {
        await GetTimesheetsByProject(null);
        expect(consoleSpy).toHaveBeenCalledWith("User not authenticated");
    });

    it("Throws an error if user is valid but has an invalid ID", async () => {

        const mockUser = { uid: null };
        await GetTimesheetsByProject(mockUser);
        expect(consoleSpy).toHaveBeenCalledWith("User ID not available");
    });

    it("", async () => {

        const mockUser = { uid: "validID" }

        const functionSpy = jest.spyOn(mockFunctions, "truncateText");
        document.getElementById = jest.fn().mockImplementation(() => {
            return { innerHTML: "" }
        });

        await GetTimesheetsByProject(mockUser);
        document.getElementById.mockRestore();
        mockFunctions.truncateText.mockRestore();
    })
})