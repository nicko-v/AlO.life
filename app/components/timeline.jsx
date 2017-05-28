import styles        from '../css/timeline.css';
import React         from 'react';
import events        from '../data/events.js';
import Toggle        from './Toggle.jsx';
import EventsList    from './EventsList.jsx';
import TimelineYears from './TimelineYears.jsx';


export default class Timeline extends React.Component {
	constructor() {
		let storedNewestFirst = JSON.parse(window.sessionStorage.getItem('timeline-newest-first'));
		let storedYears       = JSON.parse(window.sessionStorage.getItem('timeline-show-by-year'));
		let yearsList = new Set(events.map( (event) => event.date.year ));
		
		super();
		
		 /* Временно. Массив должен запрашиваться из базы в нужной сортировке согласно сохраненным настройкам. */
		if (storedNewestFirst === false) { events.reverse(); }
		/* -=-=-=- */
		
		this.state = {
			events: events,
			newestFirst: storedNewestFirst === null ? true : storedNewestFirst,
			years: new function () {
				for (let year of yearsList) {
					this[year] = (storedYears !== null && storedYears[year] !== undefined) ? storedYears[year] : true;
				}
			}
		};
		
		this.toggleTimeline = this.toggleTimeline.bind(this);
		this.toggleYear = this.toggleYear.bind(this);
	}
	
	toggleTimeline() {
		window.sessionStorage.setItem('timeline-newest-first', JSON.stringify(!this.state.newestFirst));
		
		this.setState({
			newestFirst: !this.state.newestFirst,
			events: this.state.events.reverse()
		});
	}
	
	toggleYear(e) {
		let years = this.state.years;
		
		years[e.target.dataset.year] = !years[e.target.dataset.year];
		
		this.setState({ years: years });
		
		window.sessionStorage.setItem('timeline-show-by-year', JSON.stringify(years));
	}
	
	componentDidMount() {
		document.title = 'AlO.life | Хроника событий';
	}
	
	render() {
		return (
			<main className="timeline">
				<div className="timeline-controls">
					<TimelineYears years={this.state.years} onClick={this.toggleYear} />
					<div className="timeline-toggle_wrapper">
						<p className="noselect">Сначала новые</p>
						<Toggle isActive={this.state.newestFirst} onClick={this.toggleTimeline} />
					</div>
				</div>
				<EventsList events={this.state.events.filter( (event) => this.state.years[event.date.year] )} />
			</main>
		);
	}
}