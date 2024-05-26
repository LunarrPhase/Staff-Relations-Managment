import { renderMeals } from "../src/functions.js";


describe("Testing render meals", () => {

    const mockRow = { innerHTML: null };
    const mockUsersList = { 
        innerHTML: null,
        appendChild: jest.fn().mockImplementation((row) => {
            mockRow.innerHTML = row;
        })
    };

    it("Checks HTML row element format if email exists", () => {

        const mockData = {
            name: "name",
            email: "email",
            type: "type",
            slot: "slot",
            day: "day"
        }

        const mockDoc = {
            data: jest.fn().mockImplementation(() => {
                return mockData;
            })
        };

        const mockQuerySnapshot = [ mockDoc ];
        renderMeals(mockQuerySnapshot, mockUsersList);
        expect(mockUsersList.innerHTML).toBe("");

        const text = ['<td>name</td>', '<td>email</td>', '<td>type</td>', '<td>slot</td>', '<td>day</td>'];
        for(var i = 0; i < mockRow.innerHTML.length; i++){
            expect(toString(mockRow.innerHTML.cells[i])).toBe(text[i]);
        }
    });

    
    it("Checks HTML row element format if email does not exist", () => {

        const mockData = {
            name: "name",
            email: null,
            type: "type",
            slot: "slot",
            day: "day"
        }

        const mockDoc = {
            data: jest.fn().mockImplementation(() => {
                return mockData;
            })
        };

        const mockQuerySnapshot = [ mockDoc ];
        renderMeals(mockQuerySnapshot, mockUsersList);
        expect(mockUsersList.innerHTML).toBe("");

        const text = ['<td>name</td>', '<td>email</td>', '<td>type</td>', '<td>slot</td>', '<td>day</td>'];
        for(var i = 0; i < mockRow.innerHTML.length; i++){
            expect(toString(mockRow.innerHTML.cells[i])).toBe(text[i]);
        }
    });
})