// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore-compat.js");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLBUX11qAb4Y71xTG1_y5UlW5v981SyT8",
  authDomain: "oldassignmentcentersssas.firebaseapp.com",
  projectId: "oldassignmentcentersssas",
  storageBucket: "oldassignmentcentersssas.firebasestorage.app",
  messagingSenderId: "247987287966",
  appId: "1:247987287966:web:8e40538541176de171c88f",
  measurementId: "G-1R7FS64QQF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to log event to Firestore
function logEventToFirebase(userId, eventType) {
    db.collection("events").add({
        userId: userId,
        event: eventType,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => console.log("Event logged"))
    .catch(error => console.error("Error logging event:", error));
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.includes("sssas.myschoolapp.com")) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content-script.js"]
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "logEvent") {
        logEventToFirebase(message.userId, "pageLoaded");
    }
});
