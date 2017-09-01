import React    from 'react';
import Footer   from '../components/footer/index.jsx';
import NotFound from '../components/not-found/index.jsx';


const nbsp  = String.fromCharCode(160);
const title = `Страница не${nbsp}найдена`;


export default class NotFoundView extends React.Component {
	componentDidMount() {
		document.title = `AlO.life | ${title}`;
	}
	
	render() {
		return (
			<div className="content">
				<NotFound />
				<Footer />
			</div>
		);
	}
}
