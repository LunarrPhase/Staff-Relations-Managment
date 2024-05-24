import { canBookSlot, updateAvailableSlots, bookSlot } from "../../src/firebase_functions.js";
import { mockFirebaseFunctions } from "../../mocks.js";


describe("canBookSlot functionality", () => {
    
    it("Returns true if a slot can be booked", async () => {
        const bool = await canBookSlot("2069-04-20", "08:00");
        expect(bool).toBe(true);
    });

    it("Returns false if a slot cannot be booked", async () => {
        const bool = await canBookSlot("1969-04-20", "08:00");
        expect(bool).toBe(false);
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


describe("bookSlot functionality", () => {

    let  spy; 

    beforeEach(() => {
        spy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
        window.alert.mockRestore()
    });

    it("Books slots when there are slots available", async () => {

        const mockUser = { email: "anemail@email.com" };
        jest.spyOn(window, 'alert').mockImplementation(() => {});

        document.getElementById = jest.fn().mockImplementation((name) => {
            return { value: "name" };
        });

        await bookSlot("08:00", "2069-04-20", "type", mockUser);
        expect(spy).toHaveBeenCalledWith("Successfully booked slot for 08:00!");
    });

    it("Does not book slots if there are none available", async () => {

        const mockUser = { email: "anemail@email.com" };
        document.getElementById = jest.fn().mockImplementation((name) => {
            return { value: "name" };
        });

        await(bookSlot("08:00", "1969-04-20", "type", mockUser));
        expect(spy).toHaveBeenCalledWith("No available slots today for 08:00");
    })
})


/*describe("doBooking functionality", () => {

})*/