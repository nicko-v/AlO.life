import styles      from './styles.css';
import styles_dark from './styles.dark.css';
import React       from 'react';
import EventsList  from './events-list.jsx';
import OrderToggle from './order-toggle.jsx';
import Search      from './search.jsx';
import YearsToggle from './years-toggle.jsx';


const Timeline = ({ years, toggleYear, toggleTimeline, handleSearchChange, isActive, events }) =>
	<main className="timeline">
		<div className="timeline-controls">
			<YearsToggle years={years} onClick={toggleYear} />
			<Search handleSearchChange={handleSearchChange} />
			<OrderToggle isActive={isActive} onClick={toggleTimeline} />
		</div>
		<EventsList events={events} />
	</main>;


export default Timeline;