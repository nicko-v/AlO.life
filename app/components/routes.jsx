import React       from 'react';
import Blog        from '../components/Blog.jsx';
import Shortener   from '../components/Shortener.jsx';
import About       from '../components/About.jsx';
import MainPage    from '../components/MainPage.jsx';
import Timeline    from '../components/Timeline.jsx';
import NotFound    from '../components/NotFound.jsx';

const NBSP = String.fromCharCode(160);
const PATH = '/s';


export default {
	main: {
		path: '/',
		exact: true,
		header: `Жизнь в мире Altiros${NBSP}Online`,
		content: <MainPage />
	},
	blog: {
		path: `${PATH}/blog`,
		exact: true,
		header: `Заметки об${NBSP}игре`,
		content: <Blog />
	},
	shortener: {
		path: `${PATH}/urls`,
		exact: true,
		header: `Сокращение ссылок`,
		content: <Shortener />
	},
	timeline: {
		path: `${PATH}/timeline`,
		exact: true,
		header: `Хроника заметных${NBSP}событий`,
		content: <Timeline />
	},
	about: {
		path: `${PATH}/about`,
		exact: true,
		header: `О проекте`,
		content: <About />
	},
	notfound: {
		path: '',
		exact: false,
		content: <NotFound />
	}
};