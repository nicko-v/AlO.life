import React             from 'react';
import Footer            from '../components/footer/index.jsx';
import Header            from '../components/header/index.jsx';
import TimelineContainer from '../containers/timeline.container.jsx';


const nbsp  = String.fromCharCode(160);
const title = `Хроника заметных${nbsp}событий`;


export default class TimelineView extends React.Component {
	componentDidMount() {
		document.title = `AlO.life | ${title}`;
	}
	
	render() {
		return (
			<div className="content">
				<Header text={title} />
				<TimelineContainer />
				<Footer />
			</div>
		);
	}
}
