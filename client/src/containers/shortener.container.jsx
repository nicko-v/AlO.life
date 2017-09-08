import React          from 'react';
import Shortener      from '../components/shortener/index.jsx';
import api_shortenUrl from '../api/shorten-url.js';
import validateAlias  from '../../../server/utils/validate-alias';
import validateUrl    from '../../../server/utils/validate-url';


export default class ShortenerContainer extends React.Component {
	constructor() {
		super();
		
		this.state = {
			url: '',
			alias: '',
			urlWrongInputs: 0,
			aliasWrongInputs: 0,
			urlInputAnimation: '',
			aliasInputAnimation: '',
			urlAnimationTimeout: '',
			aliasAnimationTimeout: '',
			isSpoilerExpanded: false,
			result: [],
			error: ''
		};
		
		this.toggleSpoiler     = this.toggleSpoiler.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleFormSubmit  = this.handleFormSubmit.bind(this);
		this.shakeField        = this.shakeField.bind(this);
	}
	
	toggleSpoiler() {
		this.setState({ isSpoilerExpanded: !this.state.isSpoilerExpanded });
	}
	
	handleInputChange(event) {
		this.setState({
			[event.target.name]: event.target.value.replace(event.target.name === 'url' ? /[\s]/g : /[^-\wА-Яа-яёЁ]/g, '')
		});
	}
	
	handleFormSubmit(event) {
		event.preventDefault();
		
		let url = this.state.url;
		if (url.search(/^(ftp|http|https):\/\//) === -1) { url = 'http://' + url; }
		
		try {
			validateUrl(url, 10, 2000, 'client');
			validateAlias(this.state.alias, 4, 50);
		} catch (error) {
			this.shakeField(error.where);
			this.setState({ result: [], error: error.message });
			return;
		}
		
		api_shortenUrl(url, this.state.alias)
			.then(alias => {
				const result = [...this.state.result];
				
				result.push(alias);
				this.setState({ url: '', alias: '', urlWrongInputs: 0, aliasWrongInputs: 0, error: '', result: result });
			})
			.catch(error => {
				this.shakeField(error.where);
				this.setState({ result: [], error: error.message });
			});
	}
	
	shakeField(field) {
		if (!field) { return; }
		
		clearTimeout(this.state[`${field}AnimationTimeout`]);
		this.setState({
			[`${field}WrongInputs`]: this.state[`${field}WrongInputs`] += 1,
			[`${field}InputAnimation`]: `animated ${this.state[`${field}WrongInputs`] > 10 ? 'tada' : 'shake'}`,
			[`${field}AnimationTimeout`]: setTimeout( () => this.setState({ [`${field}InputAnimation`]: '' }), 1000 )
		});
	}
	
	render() {
		const props = {
			url:    this.state.url,
			alias:  this.state.alias,
			error:  this.state.error,
			result: this.state.result,
			isSpoilerExpanded:   this.state.isSpoilerExpanded,
			urlInputAnimation:   this.state.urlInputAnimation,
			aliasInputAnimation: this.state.aliasInputAnimation,
			handleInputChange:   this.handleInputChange,
			handleFormSubmit:    this.handleFormSubmit,
			toggleSpoiler:       this.toggleSpoiler,
		};
		
		return <Shortener {...props} />;
	}
}