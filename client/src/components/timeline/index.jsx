import styles      from './styles.css';
import styles_dark from './styles.dark.css';
import React       from 'react';
import Toggle      from '../toggle/index.jsx';
import EventsList  from './events-list.jsx';
import YearsToggle from './years-toggle.jsx';


const Timeline = ({ years, toggleYear, toggleTimeline, isActive, events }) =>
	<main className="timeline">
		<div className="timeline-controls">
			<YearsToggle years={years} onClick={toggleYear} />
			<div className="timeline-controls-toggle_wrapper">
				<p className="noselect">Сначала новые</p>
				<Toggle isActive={isActive} onClick={toggleTimeline} />
			</div>
		</div>
		<EventsList events={events} />
	</main>;


export default Timeline;