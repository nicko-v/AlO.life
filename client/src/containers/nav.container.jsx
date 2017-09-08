import React      from 'react';
import Nav        from '../components/nav/index.jsx';
import isLoggedIn from '../api/is-logged-in.js'
import logout     from '../api/logout.js'


export default class NavContainer extends React.Component {
	constructor() {
		super();
		
		this.state = {
			isDropdownActive: false,
			isLoggedIn: false,
		};
		
		this.toggleDropdown = this.toggleDropdown.bind(this);
		this.closeDropdown  = this.closeDropdown.bind(this);
		this.logout = this.logout.bind(this);
	}
	
	componentWillMount() {
		isLoggedIn()
			.then(response => this.setState({ isLoggedIn: response }))
			.catch(error => console.error(error));
	}
	
	toggleDropdown() {
		this.setState({ isDropdownActive: !this.state.isDropdownActive });
	}
	
	closeDropdown() {
		this.setState({ isDropdownActive: false });
	}
	
	logout() {
		logout()
			.then(() => this.setState({ isLoggedIn: false }))
			.catch(error => console.error(error));
	}
	
	render() {
		const props = {
			toggleDropdown:   this.toggleDropdown,
			closeDropdown:    this.closeDropdown,
			logout:           this.logout,
			isDropdownActive: this.state.isDropdownActive,
			isLoggedIn:       this.state.isLoggedIn,
		};
		
		return <Nav {...props} />;
	}
}
