import React      from 'react';
import EventBlock from './event-block.jsx';


const EventsList = ({ events }) =>
	<ul className="eventslist">
		{events.map(event => <EventBlock key={event.id} event={event} />)}
		<li className="noselect">Событий нет</li>
	</ul>;


export default EventsList;