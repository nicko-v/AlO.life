import styles from '../css/toggle.css';
import React  from 'react';


export default class Toggle extends React.Component {
	render() {
		return (
			<div className={`toggle ${this.props.isActive ? 'toggle_on' : 'toggle_off'}`} onClick={this.props.onClick} />
		);
	}
}