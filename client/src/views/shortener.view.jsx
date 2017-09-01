import React              from 'react';
import Footer             from '../components/footer/index.jsx';
import Header             from '../components/header/index.jsx';
import ShortenerContainer from '../containers/shortener.container.jsx';


const title = 'Сокращение ссылок';


export default class ShortenerView extends React.Component {
	componentDidMount() {
		document.title = `AlO.life | ${title}`;
	}
	
	render() {
		return (
			<div className="content">
				<Header text={title} />
				<ShortenerContainer />
				<Footer />
			</div>
		);
	}
}
