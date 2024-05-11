import { truncateText } from "../src/functions";


describe("Check truncations", () => {

    it("ignores", () => {
        const text = "00000";
        const newtext = truncateText(text, 20);
        expect(newtext.length).toBeLessThanOrEqual(20);
    })
})

 
