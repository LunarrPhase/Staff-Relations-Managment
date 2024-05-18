import { manageDate, getDayName } from "../src/functions.js";


describe("Tests getDayName", () => {

    it("Gets correct day name", () => {

        const dayNamePast = getDayName(1969, 4, 20);
        const dayNameFuture = getDayName(2069, 4, 20);
        expect(dayNamePast).toBe("Sunday");
        expect(dayNameFuture).toBe("Saturday");
    });
});


describe("Manage date", () => {

    const customValidity = { text: null };
    const mockDateInput = {
        value: null,
        customValidity: "",
        addEventListener: jest.fn().mockImplementation((event, handler) => {
            handler();
        }),
        setCustomValidity: jest.fn().mockImplementation((errorMessage) => {
            customValidity.text = errorMessage;
        })
    };

    afterEach(() => {
        mockDateInput.value = null;
        customValidity.text = null;
    })

    it("Is Monday or Friday", () => {

        mockDateInput.value = "2022-03-25";
        manageDate(mockDateInput);
        expect(mockDateInput.value).toBe("2022-03-25");
        expect(customValidity.text).toBe("")
    })

    it("Is not Monday or Friday", () => {

        mockDateInput.value = "2022-03-24";
        manageDate(mockDateInput);
        expect(mockDateInput.value).toBe("");
        expect(customValidity.text).toBe("Please select a Monday or Friday.")
    })
})