import { FetchTimesheets } from "../../src/firebase_functions";
import { mockFunctions } from "../../mocks";


describe("FetchTimesheets Functionality", () => {

    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => jest.fn());
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it("Throws an error if input user is not valid", async () => {
         await FetchTimesheets(null);
        expect(consoleSpy).toHaveBeenCalledWith("User not authenticated");
    });

    it("Throws an error if input user's ID is not valid", async () => {
        const mockUser = { uid: undefined }
        await FetchTimesheets(mockUser);
        expect(consoleSpy).toHaveBeenCalledWith("User ID not available");
    });

    it("Throws an error if something goes wrong fetching timesheets", async () => {
        const mockUser = { uid: "poorNetwork" }
        await FetchTimesheets(mockUser);
        expect(consoleSpy).toHaveBeenCalledWith("Error fetching timesheets: ", "Network Error");
    });

    it("fetches timesheets when input user info is correct", async () => {

        const mockUser = { uid: "validID" }

        const functionSpy = jest.spyOn(mockFunctions, "truncateText");
        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {})
        document.getElementById = jest.fn().mockImplementation(() => {
            return { innerHTML: "" }
        });

        await FetchTimesheets(mockUser);
        expect(consoleSpy).toHaveBeenCalledWith("Timesheets retrieved successfully");
        expect(functionSpy).toHaveBeenCalled();

        mockFunctions.truncateText.mockRestore();
        console.log.mockRestore();
        document.getElementById.mockRestore();
    });
})