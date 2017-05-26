import styles from '../css/footer.css';
import React  from 'react';

const year = new Date().getFullYear() > 2017 ? ' - ' + new Date().getFullYear() : '';


export default class Footer extends React.Component {
	render() {
		return (
			<footer className="noselect">
				<p>2017{year} | <a href="https://vk.com/nickolay_v" target="_blank" title="VK.com">Николай Васильев</a></p>
			</footer>
		);
	}
}