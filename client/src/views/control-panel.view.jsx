import React                 from 'react';
import ControlPanelContainer from '../containers/control-panel.container.jsx';
import Footer                from '../components/footer/index.jsx';
import Header                from '../components/header/index.jsx';


const nbsp  = String.fromCharCode(160);
const title = `Панель управления`;


export default class ControlPanelView extends React.Component {
	componentDidMount() {
		document.title = `AlO.life | ${title}`;
	}
	
	render() {
		return (
			<div className="content">
				<Header text={title} />
				<ControlPanelContainer />
				<Footer />
			</div>
		);
	}
}
