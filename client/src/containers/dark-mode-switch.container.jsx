import React          from 'react';
import DarkModeSwitch from '../components/dark-mode-switch/index.jsx';


const darkStyleSheet = document.styleSheets[1];


export default class DarkModeSwitchContainer extends React.Component {
	toggleDarkMode() {
		darkStyleSheet.disabled = !darkStyleSheet.disabled;
		window.localStorage.setItem('dark-mode-off', JSON.stringify(darkStyleSheet.disabled));
	}
	
	componentWillMount() {
		const storedState = JSON.parse(window.localStorage.getItem('dark-mode-off'), (key, value) => value === null ? true : value);
		darkStyleSheet.disabled = storedState;
	}
	
	render() {
		return <DarkModeSwitch onClick={this.toggleDarkMode} />;
	}
}