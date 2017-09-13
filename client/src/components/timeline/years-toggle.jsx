import React from 'react';


const YearsToggle = ({ hiddenYears, years, onClick }) =>
	<div className="timeline-controls-yearChoice noselect">
		<p className="timeline-controls-name">Показать за год:</p>
		<div className="timeline-controls-yearChoice-years">
			{years.map(year =>
				<span className={`timeline-controls-yearChoice-years-year timeline-controls-yearChoice-years-line_${hiddenYears.has(year) ? 'over' : 'under'}`} key={year} data-year={year} onClick={onClick}>{year}</span>)}
		</div>
	</div>;
	
	
	export default YearsToggle;