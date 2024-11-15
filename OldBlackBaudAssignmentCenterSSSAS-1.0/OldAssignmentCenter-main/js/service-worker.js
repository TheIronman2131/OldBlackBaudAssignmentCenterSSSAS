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

function logPageLoad(webpage, userId, email) {
    const timestamp = Date.now(); // Generate timestamp only when a tab change is detected
    const docId = `${userId}_${timestamp}`;

    db.collection("pageLoads").doc(docId).set({
        userId: userId,
        email: email,
        webpage: webpage,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => console.log("Logged page load for URL:", webpage, "User ID:", userId, "Email:", email, "Doc ID:", docId))
    .catch(error => console.error("Error logging page load:", error));
}

// Detects when a new tab is activated
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) {
            getUserInfo((userId, email) => {
                logPageLoad(tab.url, userId, email);
            });
        }
    });
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        getUserInfo((userId, email) => {
            logPageLoad(tab.url, userId, email);
        });
    }
});

chrome.action.onClicked.addListener((tab) => {
    getDeviceId((deviceId) => {
        chrome.tabs.update(tab.id, {
            url: "https://sssas.myschoolapp.com/app/student#studentmyday/assignment-center",
        });
        logPageLoad("https://sssas.myschoolapp.com/app/student#studentmyday/assignment-center", deviceId);
    });
});
