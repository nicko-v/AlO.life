import React from 'react';


const EventBlock = ({ event }) =>
	<li>
		<div className="eventslist-date noselect">
			<p>{event.date.dayOfMonth}</p>
			<h1>{event.date.year}</h1>
		</div>
		<div className="eventslist-icon noselect"><i className={`icon-${event.icon}`} /></div>
		<div className="eventslist-descr">
			<h3>{event.name}</h3>
			{event.descr.length > 0 && <p>{event.descr}</p>}
		</div>
	</li>;


export default EventBlock;