import React    from 'react';
import { Link } from 'react-router-dom';


const authUri = 'https://oauth.vk.com/authorize?client_id=6143698&display=page&redirect_uri=https://alo.life/s/login&scope=email&v=5.67';

const AccountControls = ({ isLoggedIn, logout }) =>
	<div className="nav-account_controls">
		{isLoggedIn  && <Link to="/s/account">Аккаунт</Link>}
		{isLoggedIn  && <Link to="/" onClick={logout}>Выйти</Link>}
		{!isLoggedIn && <a href={authUri}>Войти</a>}
	</div>;


export default AccountControls;