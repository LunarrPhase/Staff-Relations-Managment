import { SetGreeting, LogOut } from "../../src/firebase_functions";


describe("SetGreeting Functionality", () => {

    beforeEach(() => {
        document.getElementById = jest.fn().mockImplementation(() => {
            return{
                style: {display: "" },
                innerHTML: ""
            }
        });
    });

    afterEach(() => {
        document.getElementById.mockRestore();
    })

    it("Does nothing if the input user is invalid", async () => {
        await SetGreeting(null)
    });

    it("throw an error when the input user's ID is invalid", async () => {

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const error = new Error("Cannot read properties of undefined (reading 'firstName')", { details: "Type Error" })
        const mockUser = { uid: undefined };

        await SetGreeting(mockUser);
        expect(consoleSpy).toHaveBeenCalledWith("Error fetching user data:", error);
        console.error.mockRestore();
    });

    it("Sets a greeting message when the input user is valid", async () => {
        const mockUser = { uid: "uid" };
        await SetGreeting(mockUser);
        expect(document.getElementById).toHaveBeenCalledTimes(2)
    });
});


describe("LogOut Functionality", () => {

    let consoleSpy;
    const mockAuth = {
        signOut: function(){
            const promise = new Promise((resolve) => {
                resolve();
            });
            return promise;
        }
    }

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, "error")//.mockImplementation(() => {});
    });

    afterEach(() => {
       console.error.mockRestore();
    })

    it("Throw an error when the user input is invalid", async () => {
        const error = new Error("Cannot read properties of null (reading 'uid')", { details: "Type Error" })
        await LogOut(null, null);
        expect(consoleSpy).toHaveBeenCalledWith("Logout Error:", error)
    });

    it("Returns to index.html when input auth and user are valid and user is in database", async () => {

        const mockUser = { uid: "uid", email: "anemail@email.com" };
        Object.defineProperty(globalThis, "window", {
            value: { location: { href: "" } },
            writable: true,
        });

        await LogOut(mockUser, mockAuth);
        expect(window).toEqual({location: {href: "index.html"} });
    });

    it("Returns to index.html when input auth and user are valid and user is in firestore", async () => {

        const mockUser = { uid: undefined, email: "email_not@realtime.db" };
        Object.defineProperty(globalThis, "window", {
            value: { location: { href: "" } },
            writable: true,
        });

        await LogOut(mockUser, mockAuth);
        expect(window).toEqual({location: {href: "index.html"} });
    });

    it("Throws an error if input auth and user are valid and user is not in firestore or realtimeDB", async () => {

        const error = new Error("User data not found in both Realtime Database and Firestore.", { details: "Type Error" })
        const mockUser = { uid: undefined, email: "email_not@firestore.db" };
        
        await LogOut(mockUser, mockAuth);
        expect(window).toEqual({location: {href: "index.html"} });
        expect(consoleSpy).toHaveBeenCalledWith("Logout Error:", error)
    })
});