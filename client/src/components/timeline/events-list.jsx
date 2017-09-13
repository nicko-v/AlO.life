import React      from 'react';
import EventBlock from './event-block.jsx';


const EventsList = ({ events, filterByType, isFilteredByType }) =>
	<ul className="timeline-eventslist" data-size={events.length}>
		{events.map(event => <EventBlock key={event.id} event={event} filterByType={filterByType} isFilteredByType={isFilteredByType} />)}
		<li className="noselect">Событий нет</li>
	</ul>;


export default EventsList;