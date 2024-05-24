import { displayBookings, displayAllBookings } from "../../src/firebase_functions.js";
import { mockFunctions } from "../../mocks.js";


describe("Meal booking functionality", () => {

    let spy; 

    beforeEach(() => {
        spy = jest.spyOn(mockFunctions, "renderMeals");
    });
    
    afterEach(() => {
        mockFunctions.renderMeals.mockRestore();
    });

    it("Calls renderMeals", async () => {
        await displayAllBookings();
        expect(spy).toHaveBeenCalled();
    })

    it("Calls renderMeals when filtering by a gicen input date", async () => {
        await displayBookings("1969-04-20");
        expect(spy).toHaveBeenCalled();
    });
});