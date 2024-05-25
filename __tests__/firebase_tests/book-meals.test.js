import { doMealBooking, populateMeals } from "../../src/firebase_functions";


describe("populateMeals functionality", () => {

    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "log").mockImplementation(() => jest.fn());
        document.createElement = jest.fn().mockImplementation(() => {
            return { text: "", value: ""};
        });
    });

    afterEach(() => {
        console.log.mockRestore();
        document.createElement.mockRestore();
    });

    it("Fills mealSelect when given the correct date and diet inputs", async () => {

        const mockDateObject = { value: "date" };
        const mockDietObject = { value: "diet" };

        const mockMealSelect = {
            
            innerHTML: "",
            add: function(val){
                console.log(val.text + " added");
                return;
            }
        };

        await populateMeals(mockDateObject, mockDietObject, mockMealSelect);
        expect(consoleSpy).toHaveBeenCalledWith("meal added");
    });
});


describe("doMealBooking functionality", () => {

    beforeEach(() => {
        document.getElementById = jest.fn().mockImplementation(() => {
            return { value: "", innerText: "" };
        });
    });
    
    afterEach(() => {
        document.getElementById.mockRestore();
    });

    const mockUser = { uid: "validID", email: "anemail@email.com" };
    const mockDietObject = { value: "diet" };
    const mockMealSelect = {
        
        innerHTML: "",
        value: "",
        add: function(val){
            console.log(val.text + " added");
            return;
        }
    };

    it("Does not do meal booking if date and diet are not selected", async () => {

        const mockObject = { value: "" };
        await doMealBooking(mockObject, mockObject, mockMealSelect, null);
        expect(document.getElementById).toHaveBeenCalledTimes(1);
    });

    it("Prevents bookings if the input date is the current or previous day", async () => {

        const mockDateObject = { value: "1969-04-20" };
        await doMealBooking(mockDateObject, mockDietObject, mockMealSelect, mockUser);
        expect(document.getElementById).toHaveBeenCalledTimes(2);
    })

    it("Calls window.alert and successfully books if the input date is valid", async () => {

        const mockDateObject = { value: "2169-04-20" };
        const windowSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        document.querySelector = jest.fn().mockImplementation((text) => {
            return { reset: function(){ return } };
        });

        await doMealBooking(mockDateObject, mockDietObject, mockMealSelect, mockUser);
        expect(windowSpy).toHaveBeenCalledWith("Successfully booked meal!")
        window.alert.mockRestore();
    });
});