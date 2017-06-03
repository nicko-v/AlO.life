import styles from '../css/content.css';
import React  from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';


export default class Content extends React.Component {
	render() {
		return (
			<div className="content">
				<Header text={this.props.header} />
				{this.props.children}
				<Footer />
			</div>
		);
	}
}
