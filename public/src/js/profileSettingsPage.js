let interactionsEnabled = true;

function sendRequest(method, route, request) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = e => {
			let response = xhr.responseText;
			if (xhr.getResponseHeader('type') === 'html') {
				resolve(response);
			} else {
				try {
					response = JSON.parse(xhr.responseText);
				} catch (e) {
					reject;
				}
				resolve(response);
			}
			if (typeof response.redirect !== 'undefined') {
				window.location.href = response.redirect;
			}
			interactionsEnabled = true;
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
	modalTitle.innerText = 'Loading';
	modalBody.innerHTML = '<progress class="progress is-small is-primary" max="100"></progress>';
	modalFooter.innerHTML = '';
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

function requestModal(method, route, request) {
	modal.classList.add('is-active');
	sendRequest(method, route, request)
		.then(result => {
			updateModal(result);
		})
		.catch(() => {
			modalError();
		});
}

//Set Dashboard content from trigger
const dashboardBody = document.getElementById('settings-page');
function setDashboard(button, method, route, request) {
	let activeMenuItem = document.getElementsByClassName('is-active');
	for (let i = 0; i < activeMenuItem.length; i++) {
		activeMenuItem[i].classList.remove('is-active');
	}
	button.classList.add('is-active');
	dashboardBody.innerHTML = '<progress class="progress is-small is-primary" max="100"></progress>';
	sendRequest(method, route, request)
		.then(result => {
			dashboardBody.innerHTML = result;
			updateTriggerHandlers();
		})
		.catch(() => {
			dashboardBody.innerHTML = 'There was an issue communicating with the server. Please try again later.';
		});
}

//Dynamically trigger handler
function updateTriggerHandlers() {
	let triggersRequest = document.getElementsByClassName('triggersRequest');

	for (let i = 0; i < triggersRequest.length; i++) {
		let dataset = triggersRequest[i].dataset;

		if (dataset.returnto === 'modal') {
			triggersRequest[i].addEventListener('click', e => {
				if (interactionsEnabled) {
					interactionsEnabled = false;
					requestModal(dataset.method, dataset.route, dataset.request);
				}
				return;
			});
		}

		if (dataset.returnto === 'dashboard') {
			triggersRequest[i].addEventListener('click', e => {
				if (interactionsEnabled) {
					interactionsEnabled = false;
					setDashboard(triggersRequest[i], dataset.method, dataset.route, dataset.request);
				}
			});
		}
	}
}
updateTriggerHandlers();

//Keypress handler
document.onkeydown = function(evt) {
	evt = evt || window.event;
	if (evt.keyCode == 27) {
		hideModal();
	}
};
