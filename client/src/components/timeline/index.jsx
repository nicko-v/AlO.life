import React       from 'react';
import EventsList  from './events-list.jsx';
import OrderToggle from './order-toggle.jsx';
import Search      from './search.jsx';
import YearsToggle from './years-toggle.jsx';


const Timeline = ({ hiddenYears, filterByYear, filterByType, toggleTimeline, handleSearchChange, isOrderToggleActive, isFilteredByType, events, years }) =>
	<main className="timeline">
		<div className="timeline-controls">
			<YearsToggle hiddenYears={hiddenYears} years={years} onClick={filterByYear} />
			<Search handleSearchChange={handleSearchChange} />
			<OrderToggle isActive={isOrderToggleActive} onClick={toggleTimeline} />
		</div>
		<EventsList events={events} filterByType={filterByType} isFilteredByType={isFilteredByType} />
	</main>;


export default Timeline;