import styles from '../css/button.css';
import React  from 'react';


const Button = ({ width, height, type, title, noValidate, onClick, text }) =>
	<button className="noselect button" style={{ width, height }} type={type} title={title} formNoValidate={noValidate} onClick={onClick}>
		{text}
	</button>;


export default Button;