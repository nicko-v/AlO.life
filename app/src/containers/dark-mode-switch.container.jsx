import React          from 'react';
import DarkModeSwitch from '../components/dark-mode-switch.jsx';

const darkStyleSheet = document.styleSheets[document.styleSheets.length - 1];


export default class DarkModeSwitchContainer extends React.Component {
	toggleDarkMode() {
		darkStyleSheet.disabled = !darkStyleSheet.disabled;
		window.localStorage.setItem('dark-mode', JSON.stringify(!darkStyleSheet.disabled));
	}
	
	componentWillMount() {
		const storedState = JSON.parse(window.localStorage.getItem('dark-mode'));
		
		darkStyleSheet.disabled = !storedState;
	}
	
	render() {
		return <DarkModeSwitch onclick={this.toggleDarkMode} />;
	}
}