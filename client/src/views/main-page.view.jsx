import React    from 'react';
import Footer   from '../components/footer/index.jsx';
import Header   from '../components/header/index.jsx';
import MainPage from '../components/main-page/index.jsx';


const nbsp  = String.fromCharCode(160);
const title = `Жизнь в мире Altiros${nbsp}Online`;


export default class MainPageView extends React.Component {
	componentDidMount() {
		document.title = 'AlO.life';
	}
	
	render() {
		return (
			<div className="content">
				<Header text={title} />
				<MainPage />
				<Footer />
			</div>
		);
	}
}