import React from 'react';


export default class EventsList extends React.Component {
	render() {
		return (
			<ul className="eventslist">
				{this.props.events.map((event, index) =>
					<li key={index}>
						<div className="eventslist-date noselect">
							<p>{new Date(event.date.year, event.date.month - 1, event.date.day).toLocaleString('ru', { day: 'numeric', month: 'long' })}</p>
							<h1>{event.date.year}</h1>
						</div>
						<div className="eventslist-icon noselect"><i className={`icon-${event.icon || 'info'}`} /></div>
						<div className="eventslist-descr">
							<h3>{event.name.trim().endsWith('.') ? event.name.trim().slice(0, -1) : event.name.trim()}</h3>
							{event.descr.length > 0 && <p>{event.descr + (event.descr.trim().endsWith('.') ? '' : '.')}</p>}
						</div>
					</li>
				)}
				<li className="noselect">Событий нет</li>
			</ul>
		);
	}
}
