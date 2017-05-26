import styles from '../css/header.css';
import React  from 'react';


export default class Header extends React.Component {
	render() {
		return this.props.text ? (
			<header className="noselect">
				<h1 className="header-title">{this.props.text}</h1>
			</header>
		) : null;
	}
}