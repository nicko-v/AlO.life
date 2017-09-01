import styles from './styles.css';
import React  from 'react';

// Для активного состояния кнопки автоматичски дописывается одноименный класс с окончанием _active


const CogButton = ({ className, isActive = false, title = 'Button', type = 'button', onClick }) => {
	const classes = `noselect icon-cog button_cog ${className} ${(isActive && className && !className.includes(' ')) ? className.trim() + '_active' : ''}`;
	
	return <button className={classes} title={title} type={type} onClick={onClick} />;
}


export default CogButton;