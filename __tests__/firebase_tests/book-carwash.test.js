import { canBookSlot, bookSlot, doBooking, updateAvailableSlots } from "../../src/firebase_functions.js";


describe("canBookSlot functionality", () => {
    
    it("Returns true if a slot can be booked on the given date and time", async () => {
        const bool = await canBookSlot("2069-04-20", "08:00");
        expect(bool).toBe(true);
    });

    it("Returns false if a slot cannot be booked on the given date and time", async () => {
        const bool = await canBookSlot("1969-04-20", "08:00");
        expect(bool).toBe(false);
    });
});


describe("updateAvailableSlots Functionality", () => {

    it("Does nothing if document has no slots left", async () => {

        const documentSpy = jest.spyOn(document, "getElementById").mockImplementation(() => { return });
        await updateAvailableSlots("2069-04-20");
        expect(documentSpy).toHaveBeenCalled();
        document.getElementById.mockRestore();
    })
})


describe("bookSlot functionality", () => {
 
    const mockUser = { email: "anemail@email.com" };
    let  windowSpy;

    beforeEach(() => {
        windowSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        document.getElementById = jest.fn().mockImplementation(() => {
                return { value: "", innerText: "", innerHTML: "" }
        });
    });

    afterEach(() => {
        window.alert.mockRestore();
        document.getElementById.mockRestore();
    });

    it("Books slots when there are slots available at the given date and time", async () => {
        await bookSlot("08:00", "2069-04-20", "type", mockUser);
        expect(windowSpy).toHaveBeenCalledWith("Successfully booked slot for 08:00!");
    });

    it("Does not book slots if there are none available at the given date and time", async () => {
        await(bookSlot("08:00", "1969-04-20", "type", mockUser));
        expect(windowSpy).toHaveBeenCalledWith("No available slots today for 08:00");
    });
});


describe("doBooking functionality", () => {

    const mockObject = { value: "value" };
    const mockUser = { uid: "validID", email: "anemail@email.com" };

    beforeEach(() => {
        document.getElementById = jest.fn().mockImplementation(() => {
            return { value: "", innerText: "", innerHTML: "" }
        });
    });
    
    afterEach(() => {
        document.getElementById.mockRestore();
    });

    it("Prevents bookings if the input date is the current or previous day", async () => {
        
        const mockDateObject = { value: "1969-04-20" };
        await doBooking(mockObject, mockObject, mockDateObject, mockUser);
        expect(document.getElementById).toHaveBeenCalledTimes(2);
    });

    it ("Calls bookSlot and successfully books if the input date is valid", async () => {

        const mockDateObject = { value: "2169-04-20" };
        const windowSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        document.querySelector = jest.fn().mockImplementation((text) => {
            return { reset: function(){ return } };
        });

        await doBooking(mockObject, mockObject, mockDateObject, mockUser);
        expect(windowSpy).toHaveBeenCalledWith("Successfully booked slot for value!")
        window.alert.mockRestore();
    });
});