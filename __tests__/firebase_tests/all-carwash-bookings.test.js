import { GetCarwashBookings } from "../../src/firebase_functions";
import { mockDoc } from "../../mocks";


describe("getCarwashBookings functionality", () => {

    it("Returns bookings when given a date", async () => {

        const mockReturnObject = mockDoc.data();
        const bookings = await GetCarwashBookings("1969-04-20");
        expect(bookings).toStrictEqual([ mockReturnObject ]);
    })
})