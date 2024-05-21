import { canBookSlot, updateAvailableSlots, bookSlot } from "../../src/firebase_functions.js";
import { mockFirebaseFunctions } from "../../mocks.js";


describe("canBookSlot functionality", () => {
    
    it("Returns true if a slot can be booked", async () => {
        const bool = await canBookSlot("Monday", "08:00");
        expect(bool).toBe(true);
    });
});


describe("updateAvailableSlots functionality", () => {

    it("Updates slots from the document", () => {

        document.getElementById = jest.fn().mockImplementation((text) => {
            return { innerHTML: "text" }
        });
        updateAvailableSlots("1969-04-20");
    });
});


/*describe("bookSlot functionality", () => {

    it("Books slots when there are slots available", () => {

        const mockUser = { email: "anemail@email.com" };
        jest.spyOn(window, 'alert').mockImplementation(() => {});

        document.getElementById = jest.fn().mockImplementation((name) => {
            return { value: "name" };
        });

        bookSlot("08:00", "1969-04-20", "type", mockUser);
        expect(spy).toHaveBeenCalled();
    });
})*/


/*describe("doBooking functionality", () => {

})*/