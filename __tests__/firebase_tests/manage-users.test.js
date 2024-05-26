import { handleRoleChange, handleUserDelete, handleFeedbackRequest, HandleEvent } from "../../src/firebase_functions.js";


describe("HandleEvent Functionality", () => {

    
    it("Calls handleRoleChange when the input target is the circle", () => {

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


describe("handleRoleChange Functionality", () => {

    it("Updates role successfully when given a valid target", () => {

        const mockTarget = {
            closest: function() {
                return { getAttribute: function(){ return true } }
            }
        };

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

        handleRoleChange(mockTarget);
    });
});


describe("handleUserDelete Functionality", () => {

    it("Deletes user successfully when given a valid target", () => {

        const mockTarget = {
            closest: function() {
                return { getAttribute: function(){ return true } }
            }
        };

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

        handleUserDelete(mockTarget);
    });
});


describe("handleFeedBackRequest Functionality", () => {

    it("Updates role successfully when given a valid target", () => {

        const mockTarget = {
            closest: function() {
                return {
                    getAttribute: function(){
                        return { toLowerCase: function(){ return true } }
                    }
                }
            }
        };

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

        handleFeedbackRequest(mockTarget);
    });
})