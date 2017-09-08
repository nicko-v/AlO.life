export default function isLoggedIn() {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		
		xhr.addEventListener('readystatechange', () => {
			if (xhr.readyState !== 4) { return; }
			
			if (xhr.status === 200 && xhr.responseText.length) {
				resolve(JSON.parse(xhr.responseText));
			} else {
				reject(`Ошибка при проверке сессии. ${xhr.status}: ${xhr.statusText}.`);
			}
		});
		
		xhr.open('GET', '/x/users?action=isLoggedIn');
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.send();
	});
}