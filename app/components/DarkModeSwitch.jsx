import styles from '../css/dark-mode-switch.css';
import React  from 'react';

const darkStyleSheet = document.styleSheets[document.styleSheets.length - 1];


export default class DarkModeSwitch extends React.Component {
	toggleDarkMode() {
		darkStyleSheet.disabled = !darkStyleSheet.disabled;
		window.localStorage.setItem('dark-mode', JSON.stringify(!darkStyleSheet.disabled));
	}
	
	componentWillMount() {
		const storedState = JSON.parse(window.localStorage.getItem('dark-mode'));
		
		darkStyleSheet.disabled = !storedState;
	}
	
	render() {
		return (
			<div className="folded_corner">
				<div className="darkmode-icon" onClick={this.toggleDarkMode} />
			</div>
		);
	}
}