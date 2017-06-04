import styles        from '../css/timeline.css';
import React         from 'react';
import Toggle        from './Toggle.jsx';
import EventsList    from './EventsList.jsx';
import TimelineYears from './TimelineYears.jsx';


export default class Timeline extends React.Component {
	constructor() {
		let storedNewestFirst = JSON.parse(window.sessionStorage.getItem('timeline-newest-first'));
		
		super();
		
		this.state = {
			newestFirst: storedNewestFirst === null ? true : storedNewestFirst,
			events: [],
			years: {}
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
		
		let storedYears = JSON.parse(window.sessionStorage.getItem('timeline-show-by-year'));
		let xhr = new XMLHttpRequest();

		xhr.open('GET', `?q=eventslist&newest=${+this.state.newestFirst}`);
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.addEventListener('readystatechange', () => {
			if (xhr.readyState != 4) { return; }
			
			if (xhr.status == 200 && xhr.responseText.length) {
				let events = JSON.parse(xhr.responseText).map( (event) => {
					return {
						name: event.name,
						descr: event.descr || '',
						icon: event.icon || 'info',
						date: {
							year:  new Date(event.date).getFullYear(),
							month: new Date(event.date).getMonth() + 1,
							day:   new Date(event.date).getDate()
						}
					};
				} );
				let yearsList = new Set(events.map( (event) => event.date.year ));
				
				this.setState({
					events: events,
					years: new function () {
						for (let year of yearsList) {
							this[year] = (storedYears !== null && storedYears[year] !== undefined) ? storedYears[year] : true;
						}
					}
				});
			} else {
				console.log(`Ошибка при получении списка событий. ${xhr.status}: ${xhr.statusText}.`);
			}
		});
		xhr.send();
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
