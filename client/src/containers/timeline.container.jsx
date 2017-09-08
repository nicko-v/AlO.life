import React             from 'react';
import Timeline          from '../components/timeline/index.jsx';
import api_getEventsList from '../api/get-events-list.js'


export default class TimelineContainer extends React.Component {
	constructor() {
		const storedNewestFirst = JSON.parse(window.sessionStorage.getItem('timeline-newest-first'));
		
		super();
		
		this.state = {
			newestFirst: storedNewestFirst === null ? true : storedNewestFirst,
			events: [],
			years: {},
			filterByPhrase: ''
		};
		
		this.toggleTimeline     = this.toggleTimeline.bind(this);
		this.toggleYear         = this.toggleYear.bind(this);
		this.handleSearchChange = this.handleSearchChange.bind(this);
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
	
	handleSearchChange(event) {
		this.setState({ filterByPhrase: event.target.value });
	}
	
	filterEvents(events) {
		const escapedInput = this.state.filterByPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regexp       = new RegExp(escapedInput, 'i');
		
		return events.filter(event => this.state.years[event.date.year] && (event.name.match(regexp) || event.descr.match(regexp)));
	}
	
	componentDidMount() {
		const storedYears = JSON.parse(window.sessionStorage.getItem('timeline-show-by-year')) || {};
		
		api_getEventsList(+this.state.newestFirst)
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
			.catch(error => console.error(error));
	}
	
	render() {
		const props = {
			years:              this.state.years,
			toggleYear:         this.toggleYear,
			handleSearchChange: this.handleSearchChange,
			isActive:           this.state.newestFirst,
			toggleTimeline:     this.toggleTimeline,
			events:             this.filterEvents(this.state.events),
		};
		
		return <Timeline {...props} />;
	}
}