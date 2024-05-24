import { getCarwashBookings } from "../../src/firebase_functions";


describe("getCarwashBookings functionality", () => {

    it("Returns bookings when given a date", async () => {

        const bookings = await getCarwashBookings("1969-04-20");
        expect(bookings).toStrictEqual([ "fullOfBookings" ])
    })
})