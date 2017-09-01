import styles      from './styles.css';
import styles_dark from './styles.dark.css';
import React       from 'react';


const DarkModeSwitch = ({ onClick }) =>
	<div className="darkmode">
		<div className="darkmode-icon" onClick={onClick} />
	</div>;


export default DarkModeSwitch;