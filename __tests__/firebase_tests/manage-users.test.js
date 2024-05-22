import { handleRoleChange } from "../../src/firebase_functions.js";


describe("", () => {

    /*it("Throws error when user", () => {

        const mockRow = {
            getAttribute: function(text){ return "dne@database.com" }
        };

        const mockTarget = {
            closest: function(){ return mockRow }
        };

        const consoleSpy = jest.spyOn(console, "error");
        handleRoleChange(mockTarget);
        expect(() => {
            handleRoleChange(mockTarget);
        }).toThrow("error")
        expect(consoleSpy).toHaveBeenCalled();
    })*/

    it("", () => {

        const mockRow = {
            getAttribute: function(text){ return "anemail@email.com" }
        };

        const mockTarget = {
            closest: function(){ return mockRow }
        };
    })
})