(function() {
	'use strict';
	const headingElements = document.querySelectorAll('h3');
	const headings = Array.from(headingElements).map((el) => {
		return {
			parent: el.closest('fieldset'),
			text: el.innerText.toLowerCase(),
			body: el.closest('fieldset').innerText.toLowerCase()
		}
	});
	// console.log(headings)
	const searchInput = document.querySelector('input[type="search"]');
	searchInput.addEventListener('input', function() {
		const query = this.value.trim().toLowerCase();
		headings.forEach(heading => {
			if (query.length) {
				const matched = heading.text.includes(query);
				if (matched) {
					heading.parent.style.display = 'block';
				} else {
					heading.parent.style.display = 'none';
				}
			} else {
				heading.parent.style.display = 'block';
			}
		});
	});
	window.addEventListener('keydown', function(event) {
		if (event.code === 'Slash' && event.ctrlKey) {
			searchInput.focus();
		}
	})
})();