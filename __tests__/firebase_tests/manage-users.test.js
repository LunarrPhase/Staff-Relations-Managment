import { handleRoleChange } from "../../src/firebase_functions.js";


const eventListener = {
    addEventListener: jest.fn().mockImplementationOnce((event, handler) => {
        handler();
    })
}


document.getElementById = jest.fn().mockImplementation((text) => {

    if (text == "roleModal"){
        return { 
            style: { display: "" },
            value: "value"
        }
    }
    else{
        return eventListener;
    }
})


document.querySelector = jest.fn().mockImplementation((text) => {
    return eventListener;
});


describe("", () => {

    it("Throws error when user", () => {

        const mockRow = {
            getAttribute: function(text){ return "dne@database.com" }
        };

        const mockTarget = {
            closest: function(){ return mockRow }
        };

        const consoleSpy = jest.spyOn(console, "error");
        //handleRoleChange()
        /*handleRoleChange(mockTarget);
        expect(() => {
            handleRoleChange(mockTarget);
        }).toThrow("error")
        expect(consoleSpy).toHaveBeenCalled();*/
    })

    it("Updates role successfully when given a valid target", () => {

        const mockrowCell = { textContent: "" };

        const mockRow = {
            getAttribute: function(text){ return "anemail@email.com" },
            querySelector: function(text){ return mockrowCell }
        };

        const mockTarget = {
            closest: function(){ return mockRow }
        };
       
        handleRoleChange(mockTarget);
    });

    it("Throws an error", () => {

        const mockRow = {
            getAttribute: function(text){ return "anemail@email.com" },
            querySelector: function(text){ throw "error" }
        };

        const mockTarget = {
            closest: function(){ return mockRow }
        };
       
        handleRoleChange(mockTarget);

    })
})