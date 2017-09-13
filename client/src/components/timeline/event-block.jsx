import React   from 'react';
import evTypes from '../../utils/events-types.js';


const EventBlock = ({ event, filterByType, isFilteredByType }) =>
	<li>
		<div className="timeline-eventslist-date noselect">
			<p className="timeline-eventslist-date-day">{event.date.dayOfMonth}</p>
			<p className="timeline-eventslist-date-year">{event.date.year}</p>
		</div>
		<div
			className={`timeline-eventslist-icon timeline-eventslist-icon_${isFilteredByType ? 'rounded' : 'squared'} noselect`}
			title={isFilteredByType ? 'Показать все события' : `Показать только события типа "${evTypes[event.type].title}"`}
			data-type={event.type}
			onClick={filterByType}
		>
			<i className={`${evTypes[event.type].icon} nopointerevents`} />
		</div>
		<div className="timeline-eventslist-descr">
			<h3>{event.name}</h3>
			{event.descr.length > 0 && <p>{event.descr}</p>}
		</div>
	</li>;


export default EventBlock;