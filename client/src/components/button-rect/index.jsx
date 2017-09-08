import styles      from './styles.css';
import styles_dark from './styles.dark.css';
import React       from 'react';


const ButtonRect = ({ width = '100px', height = '30px', fontSize = '14px', title = '', text = 'Button', type = 'button', onClick }) =>
	<button className="noselect button_rect" type={type} formNoValidate={true} style={{ width, height, fontSize }} title={title} onClick={onClick}>
		{text}
	</button>;


export default ButtonRect;