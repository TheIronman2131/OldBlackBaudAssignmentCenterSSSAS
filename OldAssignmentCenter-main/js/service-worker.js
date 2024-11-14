importScripts("https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore-compat.js");

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

function logPageLoad(webpage, deviceId) {
    db.collection("pageLoads").add({
        deviceId: deviceId,
        webpage: webpage,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => console.log("Logged page load for URL:", webpage))
    .catch(error => console.error("Error logging page load:", error));
}

chrome.webNavigation.onCompleted.addListener((details) => {
    getDeviceId((deviceId) => {
        logPageLoad(details.url, deviceId);
    });
}, { url: [{ urlMatches: "<all_urls>" }] });

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
                files: ["./js/link-modifier.js"],
            });
            logPageLoad(tab.url, deviceId);
        }

        if (
            tab.url === "https://sssas.myschoolapp.com/app/student#studentmyday/assignment-center" &&
            changeInfo.status === "complete"
        ) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["./js/view-modifier.js"],
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
