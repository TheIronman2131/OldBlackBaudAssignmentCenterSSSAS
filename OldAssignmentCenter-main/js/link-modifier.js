document.addEventListener("click", function (event) {
	const clickedElement = event.target;
	if (
		clickedElement.tagName === "A" &&
		clickedElement.href.includes("lms-assignment/assignment-center/student")
	) {
		event.preventDefault();
		window.location.href =
			"https://sssas.myschoolapp.com/lms-assignment/assignment-center/student";
	} else {
	}
});