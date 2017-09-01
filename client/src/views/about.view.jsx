import React  from 'react';
import About  from '../components/about/index.jsx';
import Footer from '../components/footer/index.jsx';
import Header from '../components/header/index.jsx';


const nbsp  = String.fromCharCode(160);
const title = `О${nbsp}проекте`;


export default class AboutView extends React.Component {
	componentDidMount() {
		document.title = `AlO.life | ${title}`;
	}
	
	render() {
		return (
			<div className="content">
				<Header text={title} />
				<About />
				<Footer />
			</div>
		);
	}
}
