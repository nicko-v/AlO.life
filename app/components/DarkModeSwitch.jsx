import styles from '../css/dark-mode-switch.css';
import React  from 'react';

const darkStyleSheet = document.styleSheets[document.styleSheets.length - 1];


export default class DarkModeSwitch extends React.Component {
	switchDarkMode() {
		darkStyleSheet.disabled = !darkStyleSheet.disabled;
		window.localStorage.setItem('darkModeOff', +darkStyleSheet.disabled);
	}
	
	componentWillMount() {
		darkStyleSheet.disabled = +window.localStorage.getItem('darkModeOff');
	}
	
	render() {
		return (
			<div className="folded_corner">
				<div className="darkmode-icon" onClick={this.switchDarkMode} />
			</div>
		);
	}
}