import styles     from '../css/timeline.css';
import React      from 'react';
import events     from '../data/events.js';
import EventsList from './eventslist.jsx';


export default React.createClass({
	getInitialState() {
		return {
			events: events.sort(this.compareNumeric),
			years: events.map((event) => event.date.year).filter((year, i, arr) => arr.indexOf(year) === i),
			skipYears: []
		};
	},
	compareNumeric(a, b) {
		return new Date(b.date.year, b.date.month - 1, b.date.day) - new Date(a.date.year, a.date.month - 1, a.date.day);
	},
	reverseList() {
		this.setState({ events: events.reverse() });
	},
	showEventsByYear(e) {
		let pos   = this.state.skipYears.indexOf(+e.target.value),
		    years = this.state.skipYears.filter(() => true);
		
		if (pos > -1) { years.splice(pos, 1); } else { years.push(+e.target.value); }
		this.setState({ skipYears: years });
	},
	render() {
		document.title = 'AlO.life | Хроника';
		return (
			<main className="timeline">
				<div className="timeline-controls">
					<div className="timeline-yearChoice noselect">
						<p>Показать за год:</p>
						<div className="timeline-years">
							{this.state.years.map((year, index) =>
								<span key={index}>
									<input id={`tl-y${year}`} value={year} type="checkbox" onChange={this.showEventsByYear} />
									<label htmlFor={`tl-y${year}`}>{year}</label>
									<div className="timeline-years-underline" style={this.state.skipYears.indexOf(year) > -1 ? { left: "-100%", bottom: "40%", transform: "translateX(100%)" } : {}} />
								</span>
							)}
						</div>
					</div>
					<div className="timeline-switcher_wrapper">
						<p className="noselect">Сначала новые</p>
						<input id="tl-switcher" type="checkbox" />
						<label className="timeline-switcher" onClick={this.reverseList} htmlFor="tl-switcher" />
					</div>
				</div>
				<EventsList events={this.state.events} skip={this.state.skipYears} />
			</main>
		);
	}
});