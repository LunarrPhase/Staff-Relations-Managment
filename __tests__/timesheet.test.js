import { truncateText } from "../src/functions";


describe("Check truncations", () => {

    const emptyText = "";
    var text = "";

    for (var i = 0; i <20; i++){
        text = text + "q";
    }

    it("Ignores when <20", () => {

        const newEmptyText = truncateText(emptyText, 20);
        const newText = truncateText(text, 20);

        expect(newEmptyText).toBe(emptyText);
        expect(newText).toBe(text);
    });

    it ("Truncates when necessary", () => {

        const longText = text + "q";
        const newText = truncateText(longText, 20);
        expect(newText).toBe(text + "...");
        expect(newText.length).toBeLessThanOrEqual(20 + 3);
    });
})

 
