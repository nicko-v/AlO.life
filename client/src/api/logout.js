export default function api_logout() {
	return new Promise((resolve, reject) => {
		const xhr  = new XMLHttpRequest();
		const data = JSON.stringify({ action: 'logout' });
		
		xhr.addEventListener('readystatechange', () => {
			if (xhr.readyState !== 4) { return; }
			
			if (xhr.status === 200) {
				resolve(true);
			} else {
				reject(JSON.parse(xhr.responseText));
			}
		});
		
		xhr.open('POST', '/x/users');
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(data);
	});
};