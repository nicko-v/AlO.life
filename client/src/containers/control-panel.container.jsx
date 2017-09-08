import React             from 'react';
import { Route, Switch } from 'react-router-dom';
import Settings          from '../components/control-panel/index.jsx';


export default class ControlPanelContainer extends React.Component {
	constructor() {
		super();
	}
	
	render() {
		const props = {
			
		};
		
		return <Settings {...props} />;
	}
}
