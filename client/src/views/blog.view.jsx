import React  from 'react';
import Blog   from '../components/blog/index.jsx';
import Footer from '../components/footer/index.jsx';
import Header from '../components/header/index.jsx';


const nbsp  = String.fromCharCode(160);
const title = `Заметки об${nbsp}игре`;


export default class BlogView extends React.Component {
	componentDidMount() {
		document.title = `AlO.life | ${title}`;
	}
	
	render() {
		return (
			<div className="content">
				<Header text={title} />
				<Blog />
				<Footer />
			</div>
		);
	}
}
