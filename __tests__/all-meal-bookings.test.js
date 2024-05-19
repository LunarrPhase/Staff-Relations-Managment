import { renderMeals } from "../src/functions.js";


describe("Testing render meals", () => {

    const mockRow = { innerHTML: null };

    const mockData = {
        name: "name",
        email: "email",
        type: "type",
        slot: "slot",
        day: "day"
    }

    const mockUsersList = { 
        innerHTML: null,
        appendChild: jest.fn().mockImplementation((row) => {
            mockRow.innerHTML = row;
        })
    };

    const mockDoc = {
        data: jest.fn().mockImplementation(() => {
            return mockData;
        })
    };

    it("Checks HTML row element format", () => {

        const mockQuerySnapshot = [ mockDoc ];
        renderMeals(mockQuerySnapshot, mockUsersList);
        expect(mockUsersList.innerHTML).toBe("");

        const text = ['<td>name</td>', '<td>email</td>', '<td>type</td>', '<td>slot</td>', '<td>day</td>'];
        for(var i = 0; i < mockRow.innerHTML.length; i++){
            expect(toString(mockRow.innerHTML.cells[i])).toBe(text[i]);
        }
    });
})