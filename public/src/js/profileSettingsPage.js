function sendRequest(method, route, request) {
	console.log('attempting post');

	return new Promise((resolve, reject) => {
		const Http = new XMLHttpRequest();
		Http.onload = e => {
			console.log('Response Recieved');
			let response = JSON.parse(Http.responseText);
			resolve(response);
		};
		Http.onerror = reject;
		Http.open(method, route);
		Http.setRequestHeader('Content-Type', 'application/json');
		let data = JSON.stringify(request);
		Http.send(data);
	});
}

//Modal Handlers
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
	content.buttons.forEach(button => {
		let newButton = `<button class="button ${button.class}">${button.text}</button>`;
		footer = footer + newButton;
	});
	modalFooter.innerHTML = footer;
}
function deleteProfile() {
	sendRequest('DELETE', '/profile')
		.then(result => {
			updateModal(result);
		})
		.catch(() => {
			modalError();
		});
}

deleteProfile();
