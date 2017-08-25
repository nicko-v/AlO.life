import styles from '../css/cog-button.css';
import React  from 'react';

// Для активного состояния кнопки автоматичски дописывается одноименный класс с окончанием _active


const CogButton = ({ className, isActive, title, type, onClick }) => {
	const classes = `noselect icon-cog cog_button ${className} ${(isActive && className && !className.includes(' ')) ? className.trim() + '_active' : ''}`;
	
	return <button className={classes} title={title} type={type} onClick={onClick} />;
}


export default CogButton;