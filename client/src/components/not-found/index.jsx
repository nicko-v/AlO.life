import React from 'react';


const NotFound = () =>
	<main className="notfound noselect">
		<h1 className="notfound-error_code">404</h1>
		<h2 className="notfound-error">Страница не&nbsp;найдена</h2>
		<hr />
		<p className="notfound-error_hint">Проверьте корректность указанного адреса, либо воспользуйтесь навигационным меню для перехода в нужный раздел сайта</p>
	</main>;


export default NotFound;