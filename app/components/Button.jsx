import styles from '../css/button.css';
import React  from 'react';

export default class Button extends React.Component {
	render() {
		return (
			<button
				className="noselect button"
				style={{ width: this.props.width, height: this.props.height }}
				type={this.props.type}
				title={this.props.title}
				formNoValidate={this.props.noValidate}
				onClick={this.props.onClick}
			>
				{this.props.text}
			</button>
		);
	}
}