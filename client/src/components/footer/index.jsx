import React from 'react';


const year = new Date().getFullYear();

const Footer = () =>
	<footer className="noselect">
		<p>{year > 2017 ? `2017 - ${year}` : '2017'} | <a href="https://vk.com/nickolay_v" className="link_unstyled" target="_blank" title="VK.com">Николай Васильев</a></p>
	</footer>;


export default Footer;