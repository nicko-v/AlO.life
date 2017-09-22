import React           from 'react';
import AccountControls from './account-controls.jsx';
import Cape            from './cape.jsx';
import ServicesList    from './services-list.jsx';


const nbsp = String.fromCharCode(160);

const Nav = ({ toggleDropdown, closeDropdown, isDropdownActive, isLoggedIn, logout }) =>
	<nav className="noselect">
		<button className="nav-mobile_dropdown" type="button" onClick={toggleDropdown}>Выбрать раздел</button>
		<Cape />
		<p className="nav-sitename">AlO.life</p>
		<ServicesList closeDropdown={closeDropdown} isDropdownActive={isDropdownActive} />
		<AccountControls isLoggedIn={isLoggedIn} logout={logout} />
	</nav>;


export default Nav;