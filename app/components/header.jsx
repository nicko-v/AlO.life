import styles from '../css/header.css';
import React  from 'react';


export default React.createClass({
	render() {
		if (!this.props.text) { return null; }
		return (
			<header className="noselect">
				<h1 className="header-title">{this.props.text}</h1>
			</header>
		);
	}
});