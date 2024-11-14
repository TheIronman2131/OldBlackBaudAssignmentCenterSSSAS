try {
	const waitForTableAndClickButtons = () => {
		const tableElement = document.querySelector("#week-view");

		if (tableElement) {
			const statusButton = document.getElementById("status2");
			if (statusButton) {
				statusButton.click();
			}
			const weekViewButton = document.getElementById("week-view");
			if (weekViewButton) {
				weekViewButton.click();
			}

			clearInterval(checkInterval);
		}
	};

	const checkInterval = setInterval(waitForTableAndClickButtons, 25);
} catch (e) {}