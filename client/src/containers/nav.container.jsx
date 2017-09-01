import React from 'react';
import Nav   from '../components/nav/index.jsx';


export default class NavContainer extends React.Component {
	constructor() {
		super();
		
		this.state = {
			isDropdownActive: false
		};
		
		this.toggleDropdown = this.toggleDropdown.bind(this);
		this.closeDropdown  = this.closeDropdown.bind(this);
	}
	
	toggleDropdown() {
		this.setState({ isDropdownActive: !this.state.isDropdownActive });
	}
	
	closeDropdown() {
		this.setState({ isDropdownActive: false });
	}
	
	render() {
		return <Nav toggleDropdown={this.toggleDropdown} closeDropdown={this.closeDropdown} isDropdownActive={this.state.isDropdownActive} />;
	}
}
