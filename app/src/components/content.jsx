import styles from '../css/content.css';
import React  from 'react';
import Footer from './footer.jsx';
import Header from './header.jsx';
import DarkModeSwitchContainer from '../containers/dark-mode-switch.container.jsx';


const Content = ({ component: Main, header }) =>
	<div className="content">
		<DarkModeSwitchContainer />
		<Header text={header} />
		<Main />
		<Footer />
	</div>;


export default Content;