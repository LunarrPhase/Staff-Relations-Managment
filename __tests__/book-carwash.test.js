import { BookCarWash, SubmitBooking } from "../src/functions.js";


const mockUser = { uid: "validID" };


describe("BookCarWash Functionality", () => {

    it("Throws an error if the input user is invalid", () => {

        const consoleSpy = jest.spyOn(console, "error");
        BookCarWash(null);
        expect(consoleSpy).toHaveBeenCalledWith("No user is signed in.");
    });
});


describe("SubmitBooking Functionality", () => {

    afterEach(() => {
        document.getElementById.mockRestore();
    })

    it("Puts up window alert if required document inputs are empty", () => {

        const windowSpy = jest.spyOn(window, "alert");
        document.getElementById = jest.fn().mockImplementation((text) => {
            return { value: "" };
        });

        SubmitBooking(mockUser);
        expect(windowSpy).toHaveBeenCalledWith("Please select both date and time slot.");
        window.alert.mockRestore();
    });

    it("Calls doBooking if required documeny inputs are filled in", async () => {

        document.querySelector = jest.fn().mockImplementation((text) => {
            return { reset: function(){ return } };
        });

        document.getElementById = jest.fn().mockImplementation((text) => {
            return { value: "value" };
        });

        await SubmitBooking(mockUser);
        expect(document.getElementById).toHaveBeenCalledTimes(5);
    });
});