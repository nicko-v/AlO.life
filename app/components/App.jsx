import styles            from '../css/app.css';
import darkStyles        from '../css/dark-mode.css';
import React             from 'react';
import DarkModeSwitch    from './DarkModeSwitch.jsx';
import Nav               from './Nav.jsx';
import Content           from './Content.jsx';
import routes            from './routes.jsx';
import { Route, Switch } from 'react-router-dom';


export default class App extends React.Component {
	render() {
		return (
			<div id="app">
				<DarkModeSwitch />
				<Nav />
				<Switch>
					{Object.keys(routes).map((route, index) => (
						<Route
							key={index}
							path={routes[route].path}
							exact={routes[route].exact}
							component={ () => <Content header={routes[route].header}>{routes[route].content}</Content> }
						/>
					))}
				</Switch>
			</div>
		);
	}
}
