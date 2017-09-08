export default function api_shortenUrl(url, alias) {
	return new Promise((resolve, reject) => {
		const xhr  = new XMLHttpRequest();
		const data = JSON.stringify({ url, alias });
		
		xhr.addEventListener('readystatechange', () => {
			if (xhr.readyState !== 4) { return; }
			
			const result = xhr.getResponseHeader('Location');
			
			if (xhr.status === 201 && result.length) {
				resolve(result);
			} else {
				reject(JSON.parse(xhr.responseText));
			}
		});
		
		xhr.open('POST', '/x/shorten-url');
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(data);
	});
};