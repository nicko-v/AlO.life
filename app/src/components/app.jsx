import styles             from '../css/app.css';
import darkStyles         from '../css/dark-mode.css';
import React              from 'react';
import About              from './about.jsx';
import Blog               from './blog.jsx';
import Content            from './content.jsx';
import MainPage           from './main-page.jsx';
import NavContainer       from '../containers/nav.container.jsx';
import NotFound           from './not-found.jsx';
import ShortenerContainer from '../containers/shortener.container.jsx';
import TimelineContainer  from '../containers/timeline.container.jsx';
import { Route, Switch }  from 'react-router-dom';


const nbsp = String.fromCharCode(160);
const layouts = {
	MainPage()           { return <Content header={`Жизнь в мире Altiros${nbsp}Online`} component={MainPage} /> },
	Blog()               { return <Content header={`Заметки об${nbsp}игре`}             component={Blog} /> },
	ShortenerContainer() { return <Content header={`Сокращение ссылок`}                 component={ShortenerContainer} /> },
	TimelineContainer()  { return <Content header={`Хроника заметных${nbsp}событий`}    component={TimelineContainer} /> },
	About()              { return <Content header={`О проекте`}                         component={About} /> },
	NotFound()           { return <Content header={null}                                component={NotFound} /> },
};

const App = () =>
	<div id="app">
		<NavContainer />
		<Switch>
			<Route exact path="/"            component={layouts.MainPage} />
			<Route exact path="/s/blog"      component={layouts.Blog} />
			<Route exact path="/s/shortener" component={layouts.ShortenerContainer} />
			<Route exact path="/s/timeline"  component={layouts.TimelineContainer} />
			<Route exact path="/s/about"     component={layouts.About} />
			<Route component={layouts.NotFound} />
		</Switch>
	</div>;


export default App;