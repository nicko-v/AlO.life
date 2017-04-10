import styles from '../css/shortener.css';
import React  from 'react';


export default React.createClass({
	render() {
		document.title = 'AlO.life | Сокращение ссылок';
		return (
			<main className="shortener">
				<input type="checkbox" id="shortener-showOptions" />
				<div className="shortener-urlField">
					<input type="text" className="shortener-urlField-input" placeholder="Укажите ссылку" />
					<label htmlFor="shortener-showOptions" className="shortener-urlField-optionsButton icon-cog noselect" title="Настройки" />
				</div>
				<div className="shortener-optionsWrapper">
  				<div className="shortener-options">
						<div className="shortener-options-url">
  						<span className="noselect">alo.life/</span>
							<input type="text" className="shortener-options-input" />
						</div>
					</div>
				</div>
				<button className="shortener-createLinkButton noselect">Сократить</button>
			</main>
		);
	}
});