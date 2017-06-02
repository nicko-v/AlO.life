import styles   from '../css/nav.css';
import React    from 'react';
import routes   from './routes.jsx';
import { Link } from 'react-router-dom';

const nbsp = String.fromCharCode(160);


export default class Nav extends React.Component {
	constructor() {
		super();
		
		this.state = {
			dropdownIsActive: false
		};
		
		this.toggleDropdown = this.toggleDropdown.bind(this);
		this.closeDropdown = this.closeDropdown.bind(this);
	}
	
	toggleDropdown() {
		this.setState({ dropdownIsActive: !this.state.dropdownIsActive });
	}
	
	closeDropdown() {
		this.setState({ dropdownIsActive: false });
	}
	
	render() {
		return (
			<nav className="noselect">
				<button className="nav-mobile_selectService" onClick={this.toggleDropdown}>Выбрать раздел</button>
				<div className="nav-cape">
					<Link to={routes.main.path} title="На главную" className="aNoAnim">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="nav-cape-heart">
							<path className="nav-cape-heart-path" d="M25 39.7l-.6-.5C11.5 28.7 8 25 8 19c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1 1.6-1.8 3.9-4.1 8-4.1 5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5z"/>
						</svg>
					</Link>
				</div>
				<p className="nav-sitename">AlO.life</p>
				<ul className={`nav-services ${this.state.dropdownIsActive ? 'nav-services_expanded' : 'nav-services_collapsed' }`} onClick={this.closeDropdown}>
					<li><Link to={routes.blog.path} className="aNoAnim">Заметки об{nbsp}игре</Link></li>
					<li><Link to={routes.timeline.path} className="aNoAnim">Хроника событий</Link></li>
					<li><Link to={routes.shortener.path} className="aNoAnim">Сокращение ссылок</Link></li>
				</ul>
				<ul className="nav-links">
					<li><Link to={routes.about.path}>Справка</Link></li>
					<li id="nav-links-separator">|</li>
					<li><Link to="/login">Войти</Link></li>
				</ul>
			</nav>
		);
	}
}