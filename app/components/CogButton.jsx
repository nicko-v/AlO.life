import styles from '../css/cog-button.css';
import React  from 'react';

export default class CogButton extends React.Component {
	render() {
		return (
			<button
				className="noselect cog_button icon-cog"
				title={this.props.title}
				style={{ color: this.props.style.color, fontSize: this.props.style.fontSize }}
				onClick={this.props.onClick}
			/>
		);
	}
}