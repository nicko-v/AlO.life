import React     from 'react';
import Blog      from '../components/blog.jsx';
import Shortener from '../components/shortener.jsx';
import About     from '../components/about.jsx';
import MainPage  from '../components/mainpage.jsx';
import Timeline  from '../components/timeline.jsx';
import NotFound  from '../components/notfound.jsx';

const nbsp = String.fromCharCode(160);


export default {
	main: {
		path: '/',
		exact: true,
		header: `Жизнь в мире Altiros${nbsp}Online`,
		content: <MainPage />
	},
	blog: {
		path: '/blog',
		exact: true,
		header: `Заметки об${nbsp}игре`,
		content: <Blog />
	},
	shortener: {
		path: '/urls',
		exact: true,
		header: `Сокращение ссылок`,
		content: <Shortener />
	},
	timeline: {
		path: '/timeline',
		exact: true,
		header: `Хроника заметных${nbsp}событий`,
		content: <Timeline />
	},
	about: {
		path: '/about',
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