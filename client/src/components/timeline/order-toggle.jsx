import React  from 'react';
import Toggle from '../toggle/index.jsx';


const OrderToggle = ({ isActive, onClick }) =>
	<div className="timeline-controls-toggle_wrapper noselect">
		<p className="timeline-controls-name">Сначала новые</p>
		<Toggle isActive={isActive} onClick={onClick} />
	</div>;


export default OrderToggle;