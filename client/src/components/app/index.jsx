import styles                  from './styles.css';
import styles_dark             from './styles.dark.css';
import React                   from 'react';
import { Route, Switch }       from 'react-router-dom';
import Nav                     from '../../components/nav/index.jsx';
import DarkModeSwitchContainer from '../../containers/dark-mode-switch.container.jsx';
import MainPageView            from '../../views/main-page.view.jsx';
import BlogView                from '../../views/blog.view.jsx';
import ShortenerView           from '../../views/shortener.view.jsx';
import TimelineView            from '../../views/timeline.view.jsx';
import AboutView               from '../../views/about.view.jsx';
import NotFoundView            from '../../views/not-found.view.jsx';


const App = () =>
	<div id="app">
		<Nav />
		<DarkModeSwitchContainer />
		<Switch>
			<Route component={MainPageView}  exact path="/" />
			<Route component={BlogView}      exact path="/s/blog" />
			<Route component={ShortenerView} exact path="/s/shortener" />
			<Route component={TimelineView}  exact path="/s/timeline" />
			<Route component={AboutView}     exact path="/s/about" />
			<Route component={NotFoundView} />
		</Switch>
	</div>;


export default App;