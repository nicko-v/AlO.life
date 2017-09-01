import styles      from './styles.css';
import styles_dark from './styles.dark.css';
import React       from 'react';


const NotFound = () =>
	<main className="notfound noselect">
		<h1>404</h1>
		<h2>Страница не&nbsp;найдена</h2>
		<hr />
		<p>Проверьте корректность указанного адреса, либо воспользуйтесь навигационным меню для перехода в нужный раздел сайта</p>
	</main>;


export default NotFound;