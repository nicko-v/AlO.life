import styles from '../css/toggle.css';
import React  from 'react';


const Toggle = ({ isActive, onClick }) =>
	<div className={`toggle toggle_${isActive ? 'on' : 'off'}`} onClick={onClick} />;


export default Toggle;