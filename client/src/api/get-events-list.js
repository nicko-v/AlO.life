export default function getEventsList(order) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		
		xhr.addEventListener('readystatechange', () => {
			if (xhr.readyState !== 4) { return; }
			
			if (xhr.status === 200 && xhr.responseText.length) {
				resolve(JSON.parse(xhr.responseText));
			} else {
				reject(`Ошибка при получении списка событий. ${xhr.status}: ${xhr.statusText}.`);
			}
		});
		
		xhr.open('GET', `/x/events-list?newestFirst=${order}`);
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.send();
	});
}