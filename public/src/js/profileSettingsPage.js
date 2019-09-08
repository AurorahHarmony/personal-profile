function sendRequest(method, route, request) {
	console.log('attempting post');

	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = e => {
			let response = JSON.parse(xhr.responseText);
			if (typeof response.redirect !== 'undefined') {
				window.location.href = response.redirect;
			}
			resolve(response);
		};
		xhr.onerror = reject;
		xhr.open(method, route);
		xhr.setRequestHeader('Content-Type', 'application/json');
		let data = JSON.stringify(request);
		xhr.send(data);
	});
}

//Modal Handlers
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalFooter = document.getElementById('modal-footer');

function modalError() {
	modalTitle.innerText = 'Error';
	modalBody.innerHTML = 'There was an issue communicating with the server. Please try again later.';
	modalFooter.innerHTML = '';
}

function updateModal(content) {
	modalTitle.innerText = content.title;

	//Set new modal content
	let body = '';
	let newElement;
	content.body.forEach(element => {
		switch (element.type) {
			case 'html':
				newElement = element.html;
				break;
			case 'input':
				switch (element.input.type) {
					case 'text':
						newElement = `<input class="input" type="text" placeholder="${element.input.defaultText}">`;
						break;
				}
				break;
		}
		body = body + newElement;
	});
	modalBody.innerHTML = body;

	//Set new modal footer
	let footer = '';
	let newButton;
	content.buttons.forEach(button => {
		if (typeof button.method !== 'undefined') {
			newButton = `<button onclick="sendRequest('${button.method}', '${button.route}')" type="submit" class="button ${button.class}">${button.text}</button>`;
		} else {
			newButton = `<button class="button ${button.class}">${button.text}</button>`;
		}
		footer = footer + newButton;
	});
	modalFooter.innerHTML = footer;
}

//Hide Modal
function hideModal() {
	modal.classList.remove('is-active');
}
function deleteProfile() {
	modal.classList.add('is-active');
	sendRequest('DELETE', '/profile')
		.then(result => {
			updateModal(result);
		})
		.catch(() => {
			modalError();
		});
}
