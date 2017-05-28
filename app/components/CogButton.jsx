import styles from '../css/cog-button.css';
import React  from 'react';

// Для активного состояния кнопки автоматичски дописывается одноименный класс с окончанием _active


export default class CogButton extends React.Component {
	render() {
		let classes = `${this.props.className} ${(this.props.isActive && this.props.className && !this.props.className.includes(' ')) ? this.props.className.trim() + '_active' : ''}`;
		
		return (
			<button
				className={`noselect icon-cog cog_button ${classes}`}
				title={this.props.title}
				onClick={this.props.onClick}
			/>
		);
	}
}