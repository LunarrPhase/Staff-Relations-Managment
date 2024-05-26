//import { SendNotification, LoadUsersWith, handleRowClick, handleSendNotification } from "../../src/Admin_feedback_request.js";
import { SendNotification, handleSendNotification } from "../../src/firebase_functions";

describe("SendNotification Functionality", () => {

    it("Throws an error when input userID is invalid", async () => {

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const mockID = undefined;

        await SendNotification(mockID, "message");
        expect(consoleSpy).toHaveBeenCalledWith( "Error sending notification:", "Undefined userID");
        console.error.mockRestore();
    });

    it("Successfully sends notification when user details are correct", async () => {

        const mockID = "validID";
        await SendNotification(mockID, "message");
        expect(fetch).toHaveBeenCalledTimes(1);
        fetch.mockClear();
    });
});


describe("handleSendFeedbackNotification Functionality", () => {

    it("Puts up an alert if exactly two users are not selected", async () => {

        const windowSpy = jest.spyOn(window, "alert").mockImplementation(() => {})
        document.querySelectorAll = jest.fn().mockImplementation(() => {
            return [];
        });

        await handleSendNotification();
        expect(windowSpy).toHaveBeenCalledWith("Please select exactly two users.");
        window.alert.mockRestore();
    });

    it("Puts up an alert if more than two users are selected", async () => {

        document.querySelectorAll = jest.fn().mockImplementation(() => {

            const mockObject = { dataset: { userId: "validID" } }
            return [ mockObject, mockObject ];
        });

        await handleSendNotification();
        expect(fetch).toHaveBeenCalledTimes(1);
        fetch.mockClear();
    });
});