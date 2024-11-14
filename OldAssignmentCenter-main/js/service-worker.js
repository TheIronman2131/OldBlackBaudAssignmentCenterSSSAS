chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.url ===
        "https://sssas.myschoolapp.com/lms-assignment/assignment-center/student"
    ) {
        chrome.tabs.update(tabId, {
            url: "https://sssas.myschoolapp.com/app/student#studentmyday/assignment-center",
        });
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
    }

    if (
        tab.url ===
            "https://sssas.myschoolapp.com/app/student#studentmyday/assignment-center" &&
        changeInfo.status === "complete"
    ) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["./js/view-modifier.js"],
        });
    }
});

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.update(tab.id, {
        url: "https://sssas.myschoolapp.com/app/student#studentmyday/assignment-center",
    });
});
