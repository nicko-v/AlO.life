import React from 'react';


const TimelineYearsToggle = ({ years, onClick }) =>
	<div className="timeline-controls-yearChoice noselect">
		<p className="timeline-controls-name">Показать за год:</p>
		<div className="timeline-controls-yearChoice-years">
			{Object.keys(years).map(year =>
				<span className={`timeline-controls-yearChoice-years-year timeline-controls-yearChoice-years-line_${years[year] ? 'under' : 'over'}`} key={year} data-year={year} onClick={onClick}>{year}</span>)}
		</div>
	</div>;
	
	
	export default TimelineYearsToggle;