import { CreateMeal } from "../../src/firebase_functions.js";


describe("CreateMeal functionality", () => {

    beforeEach(() => {
        document.getElementById = jest.fn().mockImplementation((text) => {
            return { innertext: "" }
        });
    });
    
    afterEach(() => {
        document.getElementById.mockRestore()
    });

    it("Sends a warning if the given date has passed", async () =>{
        await CreateMeal("1969-04-20", "Kosher", "Matzo ball soup");
        expect(document.getElementById).toHaveBeenCalledTimes(1);
    });

    it("", async () => {

        jest.spyOn(window, 'alert').mockImplementation(() => {});
        document.querySelector = jest.fn().mockImplementation((text) => {
            const query = { 
                reset: function(){ return }
            }
            return query;
        });

        await CreateMeal("2169-04-20", "Kosher", "Matzo ball soup");
        expect(document.getElementById).toHaveBeenCalledTimes(1);
    });
});