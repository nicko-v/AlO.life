import styles              from '../css/timeline.css';
import React               from 'react';
import Toggle              from './toggle.jsx';
import EventsList          from './events-list.jsx';
import TimelineYearsToggle from './timeline-years-toggle.jsx';


const Timeline = ({ years, toggleYear, toggleTimeline, isActive, events }) =>
	<main className="timeline">
		<div className="timeline-controls">
			<TimelineYearsToggle years={years} onClick={toggleYear} />
			<div className="timeline-toggle_wrapper">
				<p className="noselect">Сначала новые</p>
				<Toggle isActive={isActive} onClick={toggleTimeline} />
			</div>
		</div>
		<EventsList events={events} />
	</main>;


export default Timeline;