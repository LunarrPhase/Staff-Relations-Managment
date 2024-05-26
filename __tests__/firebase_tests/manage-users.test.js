import { handleRoleChange, handleUserDelete, handleFeedbackRequest, HandleEvent } from "../../src/firebase_functions.js";


describe("handleRoleChange Functionality", () => {

    document.getElementById = jest.fn().mockImplementation(() => {
        return{
            style: { display: "" },
            addEventListener: function(){ return }
        }
    });

    document.querySelector = jest.fn().mockImplementation(() => {
        return{
            addEventListener: function(){ return }
        }
    });

    it("Throws error if the user is not in the database", async () => {

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
        const mockTarget = {
            closest: function() {
                return { getAttribute: function(){ return "email_not@realtime.db" } }
            }
        };

        await handleRoleChange(mockTarget);
        expect(consoleSpy).toHaveBeenCalledWith("User not found");
        console.error.mockRestore();
    });

    it("Throws error if the promise is rejected", async () => {

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const error = new Error("Promise rejected");
        
        const mockTarget = {
            closest: function() {
                return { getAttribute: function(){ return "error" } }
            }
        };

        await handleRoleChange(mockTarget);
        expect(consoleSpy).toHaveBeenCalledWith("Error fetching user data:", error);
        console.error.mockRestore();
    });
});


describe("handleUserDelete Functionality", () => {

    document.getElementById = jest.fn().mockImplementation(() => {
        return{
            style: { display: "" },
            addEventListener: function(){ return }
        }
    });

    document.querySelector = jest.fn().mockImplementation(() => {
        return{
            addEventListener: function(){ return }
        }
    });

    it("Throws error if the user is not in the database", async () => {

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
        const mockTarget = {
            closest: function() {
                return { getAttribute: function(){ return "email_not@realtime.db" } }
            }
        };

        await handleUserDelete(mockTarget);
        expect(consoleSpy).toHaveBeenCalledWith("User not found");
        console.error.mockRestore();
    });

    it("Throws error if the promise is rejected", async () => {

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const error = new Error("Promise rejected");
        
        const mockTarget = {
            closest: function() {
                return { getAttribute: function(){ return "error" } }
            }
        };

        await handleUserDelete(mockTarget);
        expect(consoleSpy).toHaveBeenCalledWith("Error fetching user data:", error);
        console.error.mockRestore();
    });
});


describe("handleFeedBackRequest Functionality", () => {

    document.getElementById = jest.fn().mockImplementation(() => {
        return{
            style: { display: "" },
            addEventListener: function(){ return }
        }
    });

    document.querySelector = jest.fn().mockImplementation(() => {
        return{
            addEventListener: function(){ return }
        }
    })

    it("Throws error if the user is not in the database", async () => {

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
        const mockTarget = {
            closest: function() {
                return { getAttribute: function(){ return "email_not@realtime.db" } }
            }
        };

        await handleFeedbackRequest(mockTarget);
        expect(consoleSpy).toHaveBeenCalledWith("User not found");
        console.error.mockRestore();
    });

    it("Throws error if the promise is rejected", async () => {

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const error = new Error("Promise rejected");
        
        const mockTarget = {
            closest: function() {
                return { getAttribute: function(){ return "error" } }
            }
        };

        await handleFeedbackRequest(mockTarget);
        expect(consoleSpy).toHaveBeenCalledWith("Error fetching user data:", error);
        console.error.mockRestore();
    });
});


describe("HandleEvent Functionality", () => {

    it("Calls handleRoleChange when the input target is the circle", () => {

        document.getElementById = jest.fn().mockImplementation(() => {
            return{
                style: { display: "" },
                addEventListener: function(){ return }
            }
        });
    
        document.querySelector = jest.fn().mockImplementation(() => {
            return{
                addEventListener: function(){ return "" }
            }
        });

        const mockTarget = {
            classList: {
                contains: function(val){
                    if(val == "fa-circle-plus"){ return true }
                }
            },
            closest: function() {
                return { getAttribute: function(){ return true } }
            }
        };

        const mockEvent = { target: mockTarget }
        HandleEvent(mockEvent)
    });

    it("Calls handleUserDelete when the input target is the x-mark", () => {

        const mockTarget = {
            classList: {
                contains: function(val){
                    if(val == "fa-user-xmark"){ return true }
                }
            },
            closest: function() {
                return { getAttribute: function(){ return true } }
            }
        };

        const mockEvent = { target: mockTarget }
        HandleEvent(mockEvent)
    });

    it("Calls handleFeedbackRequest when the input target is the bell", () => {

        const mockTarget = {
            classList: {
                contains: function(val){
                    if(val == "fa-bell"){ return true }
                }
            },
            closest: function() {
                return {
                    getAttribute: function(){
                        return { toLowerCase: function(){ return true }}
                    }
                }
            }
        };

        const mockEvent = { target: mockTarget }
        HandleEvent(mockEvent)
    });
});