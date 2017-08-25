import React from 'react';


const TimelineYearsToggle = ({ years, onClick }) =>
	<div className="timeline-yearChoice noselect">
		<p>Показать за год:</p>
		<div className="timeline-years">
			{Object.keys(years).map(year =>
				<span className={`timeline-years-year timeline-years-line_${years[year] ? 'under' : 'over'}`} key={year} data-year={year} onClick={onClick}>{year}</span>)}
		</div>
	</div>;
	
	
	export default TimelineYearsToggle;