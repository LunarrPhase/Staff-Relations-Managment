import { AddTimeSheet } from "../../src/firebase_functions";


describe("AddTimeSheet Functionality", () => {

    let consoleSpy;
    const mockElement = { value: "ASDFGHJKL" };
    document.getElementById = jest.fn().mockImplementation((text) => {return mockElement});

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error");
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it("Throws an error when a the input auth is invalid", async () => {

        const mockAuth = { };
        await AddTimeSheet(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("User not authenticated");
    });

    it("Throws an error when the input auth has an invalid user property", async () => {

        const mockAuth = { currentUser: { uid: null } };
        await AddTimeSheet(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("User ID not available");
    });

    it("Throws an error when a timesheet cannot be added", async () => {

        const mockAuth = { currentUser: { uid: "poorNetwork" } };
        await AddTimeSheet(mockAuth);
        expect(consoleSpy).toHaveBeenCalledWith("Error adding timesheet: ", "Network Error");
    });

    it("Returns to timesheet.html when the auth is valid", async () => {

        const mockAuth = { currentUser: { uid: "validID" } };
        Object.defineProperty(globalThis, "window", {
            value: { location: { href: "" } },
            writable: true,
        });
        
        await AddTimeSheet(mockAuth);
        expect(window).toEqual({location: {href: "timesheet.html"} });
    })
})