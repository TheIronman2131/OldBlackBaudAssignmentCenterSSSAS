const emailElement = document.querySelector("table.contactcard-table td:nth-child(2)");

if (emailElement) {
    const email = emailElement.textContent.trim();
    chrome.storage.local.set({ email: email }, () => {
        console.log("Email captured and stored:", email);
    });
}