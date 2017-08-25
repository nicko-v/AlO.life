import styles from '../css/dark-mode-switch.css';
import React  from 'react';


const DarkModeSwitch = ({ onclick }) =>
	<div className="folded_corner">
		<div className="darkmode-icon" onClick={onclick} />
	</div>;


export default DarkModeSwitch;