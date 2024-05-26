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

    it("Generates Timesheet CSV if input auth is correct and database is not empty", async () => {

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

    it("Puts up an alert if input auth is correct and database is empty", async () => {

        const windowSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
        const mockAuth = { currentUser: { uid: "newID" } };

        await GenerateTimesheetCSV(mockAuth);
        expect(windowSpy).toHaveBeenCalledWith("No Timesheet History to generate CSV");
        window.alert.mockRestore();
    });
});


describe("GenerateTimesheetPDF", () => {

    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error")//.mockImplementation(() => jest.fn());
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

    it ("Alerts if input user has no timesheets to generate", async () => {

        const windowSpy = jest.spyOn(window, "alert").mockImplementation(() => {})
        const mockAuth = { currentUser: { uid: "newID" } };

        await GenerateTimesheetPDF(mockAuth);
        expect(windowSpy).toHaveBeenCalledWith("No Timesheet History to generate PDF");
        window.alert.mockRestore();
    })
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
    });

    it ("Alerts if input user has no timesheets to get", async () => {

        const windowSpy = jest.spyOn(window, "alert").mockImplementation(() => {})
        const mockUser = { uid: "newID" };

        await GetTimesheetsByTask(mockUser);
        expect(windowSpy).toHaveBeenCalledWith("No Timesheet History to display");
        window.alert.mockRestore();
    });

    it("Throws an error if there is a poor connecttion with the database", async () => {

        const mockUser = { uid: "poorNetwork" };
        await GetTimesheetsByTask(mockUser);
        expect(consoleSpy).toHaveBeenCalledWith("Error fetching and sorting timesheets: ", "Network Error");
    });
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
    });

    it ("Alerts if input user has no timesheets to get", async () => {

        const windowSpy = jest.spyOn(window, "alert").mockImplementation(() => {})
        const mockUser = { uid: "newID" };

        await GetTimesheetsByProject(mockUser);
        expect(windowSpy).toHaveBeenCalledWith("No Timesheet History to display");
        window.alert.mockRestore();
    });

    it("Throws an error if there is a poor connecttion with the database", async () => {

        const mockUser = { uid: "poorNetwork" };
        await GetTimesheetsByProject(mockUser);
        expect(consoleSpy).toHaveBeenCalledWith("Error fetching and sorting timesheets: ", "Network Error");
    });
})