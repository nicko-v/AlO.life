import styles from '../css/notfound.css';
import React  from 'react';


export default React.createClass({
	render() {
		document.title = 'AlO.life | Страница не найдена';
		return (
			<main className="notfound noselect">
				<h1>404</h1>
				<h2>Страница не&nbsp;найдена</h2>
				<hr />
				<p>Проверьте корректность указанного адреса, либо воспользуйтесь навигационным меню для перехода в нужный раздел сайта</p>
			</main>
		);
	}
});