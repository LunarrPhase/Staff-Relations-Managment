import { displayBookings, displayAllBookings } from "../../src/firebase_functions.js";


describe("Meal booking functionality", () => {

    it("Calls renderMeals", async () => {

        const consoleSpy = jest.spyOn(console, 'log');
        await displayAllBookings("1969-04-20");
        expect(consoleSpy).toHaveBeenCalledWith("Calling renderMeals.");
    })

    it("Calls renderMeals when filtering by date", async () => {

        const consoleSpy = jest.spyOn(console, 'log');
        await displayBookings("1969-04-20");
        expect(consoleSpy).toHaveBeenCalledWith("Calling renderMeals.");
    });
})