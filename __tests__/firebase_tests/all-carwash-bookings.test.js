import { GetCarwashBookings } from "../../src/firebase_functions";


describe("getCarwashBookings functionality", () => {

    it("Returns bookings when given a date", async () => {

        const bookings = await GetCarwashBookings("1969-04-20");
        expect(bookings).toStrictEqual([ "fullOfBookings" ])
    })
})