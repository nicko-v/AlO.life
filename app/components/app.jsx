import styles  from '../css/app.css';
import React   from 'react';
import Nav     from './nav.jsx';
import Content from './content.jsx';
import routes  from './routes.jsx';
import { Route, Switch } from 'react-router-dom';


export default React.createClass({
	saveDarkModeState(e) {
		window.localStorage.setItem('darkmode', +e.target.checked);
	},
	render() {
		return (
			<div id="app">
				<input type="checkbox" id="darkmode"
					defaultChecked={+window.localStorage.getItem('darkmode')}
					onChange={this.saveDarkModeState}
				/>
				<div className="folded_corner">
					<label htmlFor="darkmode" className="darkmode-icon" />
				</div>
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
});