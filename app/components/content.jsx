import styles from '../css/content.css';
import React  from 'react';
import Header from './header.jsx';
import Footer from './footer.jsx';


export default React.createClass({
	render() {
		return (
			<div className="content">
				<Header text={this.props.header} />
				{this.props.children}
				<Footer />
			</div>
		);
	}
});