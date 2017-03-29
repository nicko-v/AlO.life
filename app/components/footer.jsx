import styles from '../css/footer.css';
import React  from 'react';


export default React.createClass({
	render() {
		const year = new Date().getFullYear() > 2017 ? ' - ' + new Date().getFullYear() : '';
		
		return (
			<footer className="noselect">
				<p>2017{year} | <a href="https://vk.com/nickolay_v" target="_blank" title="VK.com">Николай Васильев</a></p>
			</footer>
		);
	}
});