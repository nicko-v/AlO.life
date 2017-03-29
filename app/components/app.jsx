import styles  from '../css/app.css';
import React   from 'react';
import cookie  from 'react-cookie';
import Nav     from './nav.jsx';
import Content from './content.jsx';
import routes  from '../data/routes.jsx';
import { Route, Switch } from 'react-router-dom';


export default React.createClass({
	setDarkModeCookie(e) {
		cookie.save('darkmode', e.target.checked, { expires: new Date(2030, 0, 1) });
	},
	render() {
		let dmEnabled = cookie.load('darkmode') == 'true';
		
		return (
			<div id="app">
				<input type="checkbox" id="darkmode" defaultChecked={dmEnabled} onChange={this.setDarkModeCookie} />
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