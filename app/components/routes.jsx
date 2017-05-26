import React     from 'react';
import Blog      from '../components/Blog.jsx';
import Shortener from '../components/Shortener.jsx';
import About     from '../components/About.jsx';
import MainPage  from '../components/MainPage.jsx';
import Timeline  from '../components/Timeline.jsx';
import NotFound  from '../components/NotFound.jsx';

const nbsp = String.fromCharCode(160);
const servicesPath = '/s';


export default {
	main: {
		path: '/',
		exact: true,
		header: `Жизнь в мире Altiros${nbsp}Online`,
		content: <MainPage />
	},
	blog: {
		path: `${servicesPath}/blog`,
		exact: true,
		header: `Заметки об${nbsp}игре`,
		content: <Blog />
	},
	shortener: {
		path: `${servicesPath}/urls`,
		exact: true,
		header: `Сокращение ссылок`,
		content: <Shortener />
	},
	timeline: {
		path: `${servicesPath}/timeline`,
		exact: true,
		header: `Хроника заметных${nbsp}событий`,
		content: <Timeline />
	},
	about: {
		path: `${servicesPath}/about`,
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