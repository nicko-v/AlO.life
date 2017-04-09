import styles from '../css/shortener.css';
import React  from 'react';


export default React.createClass({
	render() {
		document.title = 'AlO.life | Сокращение ссылок';
		return (
			<main className="shortener">
				<div className="urlField">
					<input type="text" className="urlField-input" placeholder="Укажите ссылку" />
					<input type="checkbox" id="shortenerOptions" />
					<label htmlFor="shortenerOptions" className="urlField-optionsButton icon-cog noselect" title="Настройки" />
				</div>
				<button className="createShortLink noselect">Сократить</button>
			</main>
		);
	}
});