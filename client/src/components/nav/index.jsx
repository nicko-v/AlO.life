import styles      from './styles.css';
import styles_dark from './styles.dark.css';
import React       from 'react';
import Cape        from './cape.jsx';
import { Link }    from 'react-router-dom';

const nbsp = String.fromCharCode(160);


const Nav = ({ toggleDropdown, closeDropdown, isDropdownActive }) =>
	<nav className="noselect">
		<button className="nav-mobile_selectService" onClick={toggleDropdown}>Выбрать раздел</button>
		<Cape />
		<p className="nav-sitename">AlO.life</p>
		<ul className={`nav-services nav-services_${isDropdownActive ? 'expanded' : 'collapsed' }`} onClick={closeDropdown}>
			<li><Link to="/s/blog"      className="aNoAnim">Заметки об{nbsp}игре</Link></li>
			<li><Link to="/s/timeline"  className="aNoAnim">Хроника событий</Link></li>
			<li><Link to="/s/shortener" className="aNoAnim">Сокращение ссылок</Link></li>
		</ul>
		<ul className="nav-links">
			<li><Link to="/s/about">Справка</Link></li>
			<li id="nav-links-separator">|</li>
			<li><a href="https://oauth.vk.com/authorize?client_id=6143698&display=page&redirect_uri=https://alo.life/s/login&scope=email&v=5.67">Войти</a></li>
		</ul>
	</nav>;


export default Nav;