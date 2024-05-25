import { GenerateByDiet, GenerateByDate, GenerateCSV, GeneratePDF } from "../../src/firebase_functions";


describe("GenerateByDiet Functionality", () => {

    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => jest.fn());
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it("Throws an error if input auth is not valid", async () => {
        const error = new Error("Cannot read properties of null (reading 'currentUser')", { details: "Type Error" })
        await GenerateByDiet(null);
        expect(consoleSpy).toHaveBeenCalledWith("Error fetching and sorting meal orders: ", error);
    });

    it("Throws an error if the input auth has an invalid user property", async () => {

        const mockAuth = { currentUser: null}
        await GenerateByDiet(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("User not authenticated");
    });

    it("Throws an error if input user's ID is not valid", async () => {
        const mockAuth = { currentUser: { uid: null } }
        await GenerateByDiet(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("User ID not available");
    });

    it("Generates meals by diet when user info is correct and database has values", async () => {

        const mockAuth = { currentUser: { uid: "validID" } }
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {})
        
        document.getElementById = jest.fn().mockImplementation(() => {
            return { innerHTML: "" }
        });
        await GenerateByDiet(mockAuth);
        
        expect(consoleSpy).toHaveBeenCalledWith("Meal orders retrieved and sorted by diet successfully");
        console.log.mockRestore();
        document.getElementById.mockRestore();
    });

    it("Puts up alert when user info is correct and database has no values", async () => {

        const mockAuth = { currentUser: { uid: "newID" } }
        const windowSpy = jest.spyOn(window, "alert").mockImplementation(() => {})
        
        document.getElementById = jest.fn().mockImplementation(() => {
            return { innerHTML: "" }
        });
        await GenerateByDiet(mockAuth);
        
        expect(windowSpy).toHaveBeenCalledWith("No Meal History to display");
        window.alert.mockRestore();
        document.getElementById.mockRestore();
    });
});


describe("GenerateByDate Functionality", () => {

    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => jest.fn());
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it("Throws an error if input user is not valid", async () => {
        const error = new Error("Cannot read properties of null (reading 'currentUser')", { details: "Type Error" })
        await GenerateByDate(null);
        expect(consoleSpy).toHaveBeenCalledWith("Error fetching and sorting meal orders: ", error);
    });

    it("Throws an error if the input auth has an invalid user property", async () => {

        const mockAuth = { currentUser: null}
        await GenerateByDate(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("User not authenticated");
    });

    it("Throws an error if input user's ID is not valid", async () => {
        const mockAuth = { currentUser: { uid: null } }
        await GenerateByDate(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("User ID not available");
    });

    it("Generates meals by date when user info is correct", async () => {

        const mockAuth = { currentUser: { uid: "validID" } }
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {})
        
        document.getElementById = jest.fn().mockImplementation(() => {
            return { innerHTML: "" }
        });
        await GenerateByDate(mockAuth);
        
        expect(consoleSpy).toHaveBeenCalledWith("Meal orders retrieved and sorted by date successfully");
        console.log.mockRestore();
        document.getElementById.mockRestore();
    });
});


describe("GenerateCSV", () => {

    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => jest.fn());
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it("Throws an error if the input auth is invalid", async () => {

        const error = new Error("Cannot read properties of null (reading 'currentUser')", { details: "Type Error" })
        await GenerateCSV(null);
        expect(consoleSpy).toHaveBeenCalledWith("Error generating CSV: ", error)
    })

    it("Throws an error if the input auth has an invalid user property", async () => {

        const mockAuth = { currentUser: null}
        await GenerateCSV(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("User not authenticated");
    });

    it("Throws an error if the input auth has an valid user property with an invalid ID", async () => {

        const mockAuth = { currentUser: { uid: null } };
        await GenerateCSV(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("User ID not available");
    });

    it("Generates a CSV of meal bookings if input is correct and database is not empty", async () => {

        const mockAuth = { currentUser: { uid: "validID" } };
        const documentSpy = jest.spyOn(document.body, 'appendChild');
        const mockDownloadLink = {
            href: "",
            click: function(){ return },
            setAttribute: function(){ return }
        };

        document.createElement = jest.fn().mockImplementation(() => { return mockDownloadLink });
        window.URL.createObjectURL = jest.fn().mockImplementation(() => { return "url" })
        await GenerateCSV(mockAuth);
        
        expect(documentSpy).toHaveBeenCalled();
        window.URL.createObjectURL.mockRestore();
        document.createElement.mockRestore();
    });

    it("Puts up an alert if input auth is correct and database is empty", async () => {

        const windowSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
        const mockAuth = { currentUser: { uid: "newID" } };

        await GenerateCSV(mockAuth);
        expect(windowSpy).toHaveBeenCalledWith("No Meal History to generate");
        window.alert.mockRestore();
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
        await GeneratePDF(null);
        expect(consoleSpy).toHaveBeenCalledWith("Error generating PDF: ", error)
    })

    it("Throws an error if the input auth has an invalid user property", async () => {

        const mockAuth = { currentUser: null}
        await GeneratePDF(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("User not authenticated");
    });

    it("Throws an error if the input auth has an valid user property with an invalid ID", async () => {

        const mockAuth = { currentUser: { uid: null } };
        await GeneratePDF(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("User ID not available");
    });
});