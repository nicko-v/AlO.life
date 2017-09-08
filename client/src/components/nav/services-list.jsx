import React       from 'react';
import { NavLink } from 'react-router-dom';


const nbsp = String.fromCharCode(160);
const classes = {
	className: 'aNoAnim',
	activeClassName: 'nav-services-service_current'
};

const ServicesList = ({ closeDropdown, isDropdownActive }) =>
	<ul className={`nav-services nav-services_${isDropdownActive ? 'expanded' : 'collapsed' }`} onClick={closeDropdown}>
		<li><NavLink to="/s/blog"      {...classes}>Заметки об{nbsp}игре</NavLink></li>
		<li><NavLink to="/s/timeline"  {...classes}>Хроника событий</NavLink></li>
		<li><NavLink to="/s/shortener" {...classes}>Сокращение ссылок</NavLink></li>
	</ul>;


export default ServicesList;