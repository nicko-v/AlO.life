import styles from '../css/footer.css';
import React  from 'react';

const year = new Date().getFullYear() > 2017 ? ' - ' + new Date().getFullYear() : '';


const Footer = () =>
	<footer className="noselect">
		<p>2017{year} | <a href="https://vk.com/nickolay_v" target="_blank" title="VK.com">Николай Васильев</a></p>
	</footer>;


export default Footer;