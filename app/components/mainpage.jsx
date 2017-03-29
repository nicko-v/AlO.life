import styles from '../css/mainpage.css';
import React  from 'react';


export default React.createClass({
	render() {
		document.title = 'AlO.life';
		return (
			<main className="mainpage noselect">
				<h3>Привет!</h3>
				<br />
				<p>Меня зовут Николай, а это место посвящено игре <a href="https://altiros.net/" target="_blank">Altiros Online</a> - MMORPG с полностью изменяемым миром-песочницей.</p>
				<p>Здесь я веду небольшой блог о жизни в мире АлО - заметки, которые, надеюсь, будет интересно почитать другим игрокам. Сохраняю важные, на мой взгляд, исторические события на временной шкале, а так же работаю над некоторыми другими полезными околоигровыми сервисами.</p>
			</main>
		);
	}
});