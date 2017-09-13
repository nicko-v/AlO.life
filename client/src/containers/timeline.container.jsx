import React             from 'react';
import Timeline          from '../components/timeline/index.jsx';
import api_getEventsList from '../api/get-events-list.js';


export default class TimelineContainer extends React.Component {
	constructor() {
		super();
		
		const storedNewestFirst = JSON.parse(window.sessionStorage.getItem('timeline-newest-first'));
		const storedHiddenYears = JSON.parse(window.sessionStorage.getItem('timeline-hidden-years'));
		
		this.state = {
			newestFirst: storedNewestFirst === null ? true : storedNewestFirst,
			hiddenYears: new Set(storedHiddenYears),
			showOnlyType: undefined,
			filterByPhrase: '',
			events: [],
			years: [],
		};
		
		this.toggleTimeline     = this.toggleTimeline.bind(this);
		this.filterByYear       = this.filterByYear.bind(this);
		this.filterByType       = this.filterByType.bind(this);
		this.handleSearchChange = this.handleSearchChange.bind(this);
	}
	
	toggleTimeline() {
		window.sessionStorage.setItem('timeline-newest-first', JSON.stringify(!this.state.newestFirst));
		
		this.setState({
			newestFirst: !this.state.newestFirst,
			events: this.state.events.reverse()
		});
	}
	
	filterByYear(e) {
		const year = +e.target.dataset.year;
		const hiddenYears = new Set(this.state.hiddenYears);
		
		hiddenYears.has(year) ? hiddenYears.delete(year) : hiddenYears.add(year);
				
		this.setState({ hiddenYears });
		
		window.sessionStorage.setItem('timeline-hidden-years', JSON.stringify(Array.from(hiddenYears, item => +item)));
	}
	
	filterByType(e) {
		const type = +e.target.dataset.type;
		const showOnlyType = isFinite(this.state.showOnlyType) ? undefined : type; // Если уже число - сброс, иначе новое число.
		
		this.setState({ showOnlyType });
	}
	
	handleSearchChange(event) {
		this.setState({ filterByPhrase: event.target.value });
	}
	
	filterEvents(events) {
		const escapedInput = this.state.filterByPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regexp       = new RegExp(escapedInput, 'i');
		
		return events.filter(event =>
												 !this.state.hiddenYears.has(event.date.year) &&
												 (this.state.showOnlyType === undefined || this.state.showOnlyType === event.type) &&
												 (event.name.match(regexp) || event.descr.match(regexp))
												);
	}
	
	componentDidMount() {
		api_getEventsList(+this.state.newestFirst)
			.then(events => {
				const _years = new Set(events.map(event => event.date.year));
				const years = Array.from(_years, item => +item).sort();
				
				this.setState({ events, years });
			})
			.catch(error => console.error(error));
	}
	
	render() {
		const props = {
			hiddenYears:         this.state.hiddenYears,
			filterByYear:        this.filterByYear,
			filterByType:        this.filterByType,
			toggleTimeline:      this.toggleTimeline,
			handleSearchChange:  this.handleSearchChange,
			isOrderToggleActive: this.state.newestFirst,
			events:              this.filterEvents(this.state.events),
			years:               this.state.years,
			isFilteredByType:    isFinite(this.state.showOnlyType),
		};
		
		return <Timeline {...props} />;
	}
}