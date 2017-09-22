import React  from 'react';

// Для активного состояния кнопки автоматичски дописывается одноименный класс с окончанием _active


const CogButton = ({ className, isActive = false, title = '', type = 'button', onClick }) => {
	const classes = `noselect icon-cog button_cog ${className} ${isActive ? 'button_cog_active' : ''}`;
	
	return <button className={classes} title={title} type={type} onClick={onClick} />;
}


export default CogButton;