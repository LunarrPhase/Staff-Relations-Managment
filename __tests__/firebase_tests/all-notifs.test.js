import { SendHome, GetCurrentUserMealBookings, GetCurrentUserCarWashBookings, GetCurrentUserFeedbackNotifications } from "../../src/firebase_functions";
import { mockFunctions } from "../../mocks";


describe("Send Home functionality", () => {

    let consoleSpy; 

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error");
    });

    afterEach(() => {
        console.error.mockRestore()
    });

    it("Calls ChangeWindow when user is valid", async () => {

        const spy = jest.spyOn(mockFunctions, "ChangeWindow");
        const mockUser = { uid: "validID" };
        await SendHome(mockUser);
        expect(spy).toHaveBeenCalled();
    });

    it("Throws an error when user role is not found", async () => {

        const mockUser = { uid: null };
        await SendHome(mockUser);
        expect(consoleSpy).toHaveBeenCalledWith("Error getting user role:", "ID not found");
    });

    it("Goes to index.html when user is invalid", async () => {

        Object.defineProperty(globalThis, "window", {
            value: { location: { href: "" } },
            writable: true,
        });
        
        await SendHome(null);
        expect(window).toEqual({location: {href: "index.html"} });
    });
});


describe("Getting current meal bookings", () => {

    let consoleSpy; 

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error");
    });

    afterEach(() => {
        console.error.mockRestore()
    });

    it ("Throws error when user ID is invalid and calls Send Home", async () => {

        const mockUser = { uid: null };
        await GetCurrentUserMealBookings(mockUser);
        expect(consoleSpy).toHaveBeenCalledWith("User ID not available");
        expect(consoleSpy).toHaveBeenCalledWith("Error getting user role:", "ID not found");
    });

    it ("Returns an array of meal bookings when user ID is valid", async () => {

        const mockUser = { uid: "validID" };
        const mealBookings = await GetCurrentUserMealBookings(mockUser);
        expect(mealBookings).toStrictEqual([ "fullOfBookings"]);
    });
});


describe("Getting current carwash bookings", () => {

    it ("Returns an array of carwash bookings", async () => {

        const mockUser = { uid: "validID" };
        const carWashBookings = await GetCurrentUserCarWashBookings(mockUser);
        expect(carWashBookings).toStrictEqual([ "fullOfBookings" ]);
    });
});


describe("Getting current user feedback notifications", () =>{ 

    let consoleSpy; 

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error");
    });

    afterEach(() => {
        console.error.mockRestore()
    });

    it("Throws an error if the input user email does not exist", async () => {

        const userFeedback = await GetCurrentUserFeedbackNotifications(false);
        expect(consoleSpy).toHaveBeenCalledWith("User email not available");
        expect(userFeedback).toStrictEqual([]);
    });

    it("Returns an array of feedback notifications", async () => {

        const userFeedback = await GetCurrentUserFeedbackNotifications("anemail@email.com");
        expect(userFeedback).toStrictEqual([ "fullOfBookings" ]);
    });

    it("Throws an error when the email has the database return a querying error", async () => {

        const userFeedback = await GetCurrentUserFeedbackNotifications("invalid_query@database.com");
        expect(consoleSpy).toHaveBeenCalledWith("Error fetching feedback notifications:", "Querying error");
        expect(userFeedback).toStrictEqual([]);
    })
})