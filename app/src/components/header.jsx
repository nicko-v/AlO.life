import styles from '../css/header.css';
import React  from 'react';


const Header = ({ text }) =>
	text &&
		<header className="noselect">
			<h1 className="header-title">{text}</h1>
		</header>;


export default Header;
