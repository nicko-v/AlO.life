import React from 'react';


export default class TimelineYears extends React.Component {
	render() {
		return (
			<div className="timeline-yearChoice noselect">
				<p>Показать за год:</p>
				<div className="timeline-years">
					{Object.keys(this.props.years).map((year, index) =>
						<span className={`timeline-years-year ${this.props.years[year] ? 'timeline-years-line_under' : 'timeline-years-line_over'}`} key={index} data-year={year} onClick={this.props.onClick}>{year}</span>)}
				</div>
			</div>
		);
	}
}