importScripts("/firebase/firebase-app-compat.js", "/firebase/firebase-firestore-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyCLBUX11qAb4Y71xTG1_y5UlW5v981SyT8",
    authDomain: "oldassignmentcentersssas.firebaseapp.com",
    projectId: "oldassignmentcentersssas",
    storageBucket: "oldassignmentcentersssas.firebasestorage.app",
    messagingSenderId: "247987287966",
    appId: "1:247987287966:web:8e40538541176de171c88f",
    measurementId: "G-1R7FS64QQF"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function getDeviceId(callback) {
    chrome.storage.local.get(["deviceId"], (result) => {
        if (result.deviceId) {
            callback(result.deviceId);
        } else {
            const deviceId = "device-" + Math.random().toString(36).substr(2, 9);
            chrome.storage.local.set({ deviceId: deviceId }, () => {
                callback(deviceId);
            });
        }
    });
}

function getUserInfo(callback) {
    chrome.storage.local.get(["userId", "email"], (result) => {
        const userId = result.userId || "user-" + Math.random().toString(36).substr(2, 9);
        
        if (!result.userId) {
            chrome.storage.local.set({ userId: userId });
        }
        
        callback(userId, result.email || "");
    });
}

function logPageLoad(webpage, userId, email = "") {
    db.collection("pageLoads").add({
        userId: userId,
        email: email || "",  // Ensure email is a valid string
        webpage: webpage,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => console.log("Logged page load for URL:", webpage, "User ID:", userId, "Email:", email))
    .catch(error => console.error("Error logging page load:", error));
}

chrome.webNavigation.onCompleted.addListener((details) => {
    getUserInfo((userId, email) => {
        logPageLoad(details.url, userId, email);
    });
}, { url: [{ urlMatches: ".*" }] });

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        getUserInfo((userId, email) => {
            logPageLoad(tab.url, userId, email);
        });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    getDeviceId((deviceId) => {
        if (changeInfo.url === "https://sssas.myschoolapp.com/lms-assignment/assignment-center/student") {
            chrome.tabs.update(tabId, {
                url: "https://sssas.myschoolapp.com/app/student#studentmyday/assignment-center",
            });
            logPageLoad(changeInfo.url, deviceId);
        }

        if (
            tab.url.includes("sssas.myschoolapp.com") &&
            tab.url != "https://sssas.myschoolapp.com/app/student#studentmyday/assignment-center" &&
            changeInfo.status === "complete"
        ) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["OldAssignmentCenter-main/js/link-modifier.js"], // Adjusted path for clarity
            });
            logPageLoad(tab.url, deviceId);
        }

        if (
            tab.url === "https://sssas.myschoolapp.com/app/student#studentmyday/assignment-center" &&
            changeInfo.status === "complete"
        ) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["OldAssignmentCenter-main/js/view-modifier.js"], // Adjusted path for clarity
            });
            logPageLoad(tab.url, deviceId);
        }
    });
});

chrome.action.onClicked.addListener((tab) => {
    getDeviceId((deviceId) => {
        chrome.tabs.update(tab.id, {
            url: "https://sssas.myschoolapp.com/app/student#studentmyday/assignment-center",
        });
        logPageLoad("https://sssas.myschoolapp.com/app/student#studentmyday/assignment-center", deviceId);
    });
});
