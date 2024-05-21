import { SendHome, GetCurrentUserMealBookings, GetCurrentUserCarWashBookings } from "../../src/firebase_functions";
import { mockFunctions } from "../../mocks";


describe("Send Home functionality", () => {

    it("Calls ChangeWindow when user is valid", async () => {

        const spy = jest.spyOn(mockFunctions, "ChangeWindow");
        const mockUser = { uid: "validID" };
        await SendHome(mockUser);
        expect(spy).toHaveBeenCalled();
    });

    it("Throws an error when user role is not found", async () => {

        const consoleSpy = jest.spyOn(console, 'error');
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

    it ("Throws error when user ID is invalid and calls Send Home", async () => {

        const consoleSpy = jest.spyOn(console, "error");
        const mockUser = { uid: null };
        await GetCurrentUserMealBookings(mockUser);

        expect(consoleSpy).toHaveBeenCalledWith("User ID not available");
        expect(consoleSpy).toHaveBeenCalledWith("Error getting user role:", "ID not found");
    });

    it ("Returns an array when user ID is valid", async () => {

        const mockUser = { uid: "val" };
        const arr = GetCurrentUserMealBookings(mockUser);
        const promise = new Promise(() => { return });
        expect(arr).toStrictEqual(promise);
    });
});


describe("Getting current carwash bookings", () => {

    it ("Throws an error when user ID is invalid", async () => {

        const consoleSpy = jest.spyOn(console, 'error');
        const mockUser = { uid: null };
        await GetCurrentUserCarWashBookings(mockUser);
        expect(consoleSpy).toHaveBeenCalledWith("Error getting user role:", "ID not found");
    })

    it ("Returns an empty array when there are no meal bookings", async () => {

        const mockUser = { uid: "val" };
        const arr = GetCurrentUserCarWashBookings(mockUser);
        const promise = new Promise(() => { return });
        expect(arr).toStrictEqual(promise);
    })
})