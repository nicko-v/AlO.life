import styles      from './styles.css';
import styles_dark from './styles.dark.css';
import React       from 'react';


const ButtonRect = ({ width = '100px', height = '30px', fontSize = '14px', title = 'Button', text = 'Button', onClick }) =>
	<button className="noselect button_rect" type="button" formNoValidate={true} style={{ width, height, fontSize }} title={title} onClick={onClick}>
		{text}
	</button>;


export default ButtonRect;