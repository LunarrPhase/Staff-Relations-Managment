import { CheckUserAuthenticated, CreateCarWashNotificationElement, CreateMealNotificationElements, CreateFeedbackNotificationElement, PopulateNotifications } from "../src/functions.js";


describe("Checks user authenticated", () => {

    const mockUser = {
        uid: "ID"
    };

    const mockAuth = {
        currentUser: mockUser
    };

    it("Returns user when valid", () => {
        const user = CheckUserAuthenticated(mockAuth);
        expect(user).toBe(mockUser);
    });

    it("Returns null when invalid", () => {

        mockUser.uid = null;
        jest.spyOn(console, 'error').mockImplementation(() => {});
        mockAuth.currentUser = null;

        const user1 = CheckUserAuthenticated(null);
        const user2 = CheckUserAuthenticated(mockAuth);

        expect(user1).toBe(null);
        expect(user2).toBe(null);
    });
})


describe("Creating notification elements", () => {

    const mockClassList = {
        add: jest.fn().mockImplementation((text) => {})
    }

    const mockElement = {
        innerText: null,
        outerText: null,
        classList: mockClassList
    }

    jest.spyOn(document, 'createElement').mockImplementation((val) => {
        mockElement.outerText = val;
        return mockElement;
    });    

    it("Returns meal notification element", () => {

        const mockMealBooking = {
            diet: "Paleo",
            meal: "Cabbage soup"
        }

        const mockMealBookings = [ mockMealBooking ];
        const notifications = CreateMealNotificationElements(mockMealBookings);
        const notif = notifications[0];

        expect(notifications.length).toBe(mockMealBookings.length);
        expect(notif.outerText).toBe("div");
        expect(notif.innerText).toBe("Today you booked a Paleo meal of: Cabbage soup.")
    });

    it("Returns car wash notification element", () => {

        const mockCarWashBooking = {
            type: "Deluxe",
            slot: "8:00 AM"
        }

        const mockCarWashBookings = [ mockCarWashBooking ]; 
        const notifications = CreateCarWashNotificationElement(mockCarWashBookings);
        const notif = notifications[0];

        expect(notifications.length).toBe(mockCarWashBookings.length);
        expect(notif.outerText).toBe("div");
        expect(notif.innerText).toBe("Today you booked a Deluxe car wash for today's 8:00 AM slot.");
    });

    it("Returns feedback notification element", () => {

        const mockFeedbackNotif = { recipient: "anemail@email.com" }

        const mockFeedbackNotifs = [ mockFeedbackNotif ]; 
        const notifications = CreateFeedbackNotificationElement(mockFeedbackNotifs);
        const notif = notifications[0];

        expect(notifications.length).toBe(mockFeedbackNotifs.length);
        expect(notif.outerText).toBe("div");
        expect(notif.innerText).toBe("Please give feedback to anemail@email.com.");
    })
});


describe("Testing populate notification", () => {
    it("Populates notification container", () => {
        
        var arr = [];

        const mockNotificationsContainer = {
            appendChild: jest.fn().mockImplementation((element) => {
                arr.push(element);
            })
        };

        const mockCombinedElements = ["Today you booked a Deluxe car wash for today's 8:00 AM slot.", "Today you booked a Paleo meal of: Cabbage soup."];
        PopulateNotifications(mockNotificationsContainer, mockCombinedElements);
        expect(arr).toStrictEqual(mockCombinedElements);
    });
});