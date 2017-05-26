import styles from '../css/main-page.css';
import React  from 'react';


export default class MainPage extends React.Component {
	componentDidMount() {
		document.title = 'AlO.life';
	}
	
	render() {
		return (
			<main className="mainpage noselect">
				<h3>Привет!</h3>
				<br />
				<p>Меня зовут Николай, а это место посвящено игре <a href="https://altiros.net/" target="_blank">Altiros Online</a> – MMORPG с полностью изменяемым миром-песочницей.</p>
				<p>Здесь я веду небольшой блог о жизни в мире АлО – заметки, которые, надеюсь, будет интересно почитать другим игрокам. Сохраняю важные, на мой взгляд, исторические события на временной шкале, а так же работаю над некоторыми другими полезными околоигровыми сервисами.</p>
				<p>На текущий момент игра все еще находится в стадии разработки, что, впрочем, не мешает мне активно заниматься этим сайтом, ведь основной целью является изучение различных веб-технологий на реальном проекте, а часть необходимых в будущем сервисов можно спрогнозировать, исходя из опыта жизни на GC – предыдущей игре разработчика.</p>
			</main>
		);
	}
}