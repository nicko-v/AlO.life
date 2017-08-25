import React         from 'react';
import Timeline      from '../components/timeline.jsx';
import getEventsList from '../api/get-events-list.js'


export default class TimelineContainer extends React.Component {
	constructor() {
		const storedNewestFirst = JSON.parse(window.sessionStorage.getItem('timeline-newest-first'));
		
		super();
		
		this.state = {
			newestFirst: storedNewestFirst === null ? true : storedNewestFirst,
			events: [],
			years: {}
		};
		
		this.toggleTimeline = this.toggleTimeline.bind(this);
		this.toggleYear     = this.toggleYear.bind(this);
	}
	
	toggleTimeline() {
		window.sessionStorage.setItem('timeline-newest-first', JSON.stringify(!this.state.newestFirst));
		
		this.setState({
			newestFirst: !this.state.newestFirst,
			events: this.state.events.reverse()
		});
	}
	
	toggleYear(e) {
		const years = this.state.years;
		
		
		years[e.target.dataset.year] = !years[e.target.dataset.year];
		
		this.setState({ years });
		
		window.sessionStorage.setItem('timeline-show-by-year', JSON.stringify(years));
	}
	
	componentDidMount() {
		document.title = 'AlO.life | Хроника событий';
		
		const storedYears = JSON.parse(window.sessionStorage.getItem('timeline-show-by-year')) || {};
		
		getEventsList(+this.state.newestFirst)
			.then(events => {
				const yearsList = new Set(events.map( (event) => event.date.year ));
				
				this.setState({
					events: events,
					years: new function () {
						for (let year of yearsList) {
							this[year] = (storedYears[year] !== undefined) ? storedYears[year] : true;
						}
					}
				});
			})
			.catch(error => console.log(error));
	}
	
	render() {
		const props = {
			years:          this.state.years,
			toggleYear:     this.toggleYear,
			isActive:       this.state.newestFirst,
			toggleTimeline: this.toggleTimeline,
			events:         this.state.events.filter(event => this.state.years[event.date.year]),
		};
		
		return <Timeline {...props} />;
	}
}