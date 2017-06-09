import styles    from '../css/shortener.css';
import React     from 'react';
import Button    from './Button.jsx'
import CogButton from './CogButton.jsx'
import { Link }  from 'react-router-dom';


function ResultMessage(props) {
	switch (props.url) {
		case undefined: return null;
		case '':        return <p className="shortener-result shortener-result-error noselect animated flash">Ошибка при сокращении ссылки.</p>;
		default:        return <p className="shortener-result shortener-result-success noselect animated fadeInDown">Ссылка сокращена: <Link to={props.url}>{props.url}</Link></p>;
	}
}

export default class Shortener extends React.Component {
	constructor() {
		super();
		
		this.state = {
			expanded: false,
			fullURL: '',
			shortURL: '',
			fullURLAnimation: '',
			shortURLAnimation: '',
			fullURLWrongInputs: 0,
			shortURLWrongInputs: 0,
			result: undefined
		};
		
		this.rollOptionsBlock  = this.rollOptionsBlock.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleFormSubmit  = this.handleFormSubmit.bind(this);
		this.shakeField        = this.shakeField.bind(this);
	}
	
	componentDidMount() {
		document.title = 'AlO.life | Сокращение ссылок';
	}
	
	rollOptionsBlock() {
		this.setState({ expanded: !this.state.expanded });
	}
	
	handleInputChange(event) {
		this.setState({
			[event.target.name]: event.target.value.replace(event.target.name === 'fullURL' ? /[\s]/g : /[^-\wА-Яа-яёЁ]/g, '')
		});
	}
	
	handleFormSubmit(event) {
		event.preventDefault();
		
		let xhr = new XMLHttpRequest();
		
		function isInputCorrect(url, type) {
			let regexp = new RegExp(type === 'fullURL' ? '^[^\\s]+?\\.[^\\s\\d\\.]{1,20}($|(\\/\\S+?$))' : '^[\\w-]+?$');
			
			if ((type === 'fullURL' && url.length > 1000) || (type === 'shortURL' && url.length > 50)) { return false; }
			if (type === 'shortURL' && url.length === 0) { return true; }
			
			return regexp.test(url);
		}
		
		if (!isInputCorrect(this.state.fullURL, 'fullURL'))   { this.shakeField('fullURL');  return; }
		if (!isInputCorrect(this.state.shortURL, 'shortURL')) { this.shakeField('shortURL'); return; }
		
		/*xhr.open('GET', `?q=shortenURL&fullURL=${this.state.fullURL}&shortURL=${this.state.shortURL}`);
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.addEventListener('readystatechange', () => {
			if (xhr.readyState != 4) { return; }
			
			if (xhr.status == 200 && xhr.responseText.length) {
				this.setState({ fullURL: '', shortURL: '', fullURLWrongInputs: 0, shortURLWrongInputs: 0, result: xhr.responseText });
			} else {
				this.setState({ result: '' });
				console.log(`Ошибка при создании короткой ссылки. ${xhr.status}: ${xhr.statusText}.`);
			}
		});
		xhr.send();*/
	}
	
	shakeField(field) {
		this.setState({
			[`${field}WrongInputs`]: this.state[`${field}WrongInputs`] += 1,
			[`${field}Animation`]: `animated ${this.state[`${field}WrongInputs`] > 6 ? this.state[`${field}WrongInputs`] > 12 ? 'tada' : 'wobble' : 'shake'}`
		});
		setTimeout( () => this.setState({ [`${field}Animation`]: '' }), 1000 );
	}
	
	render() {
		let fullURLAttrs = {
			className:      'shortener-form-urlField-input',
			autoComplete:   'off',
			placeholder:    'Укажите ссылку',
			title:          'Сокращаемый адрес',
			type:           'url',
			name:           'fullURL',
			spellCheck:     'false',
			value:          this.state.fullURL,
			onChange:       this.handleInputChange
		};
		let shortURLAttrs = {
			className:    'shortener-form-options-input',
			autoComplete: 'off',
			title:        'Желаемый адрес (необязательно). До 50 символов: A-z, А-я, -, _',
			type:         'text',
			name:         'shortURL',
			spellCheck:   'false',
			value:        this.state.shortURL,
			onChange:     this.handleInputChange,
		};
		let cogAttrs = {
			className: 'shortener-form-urlField-cog',
			title:     'Настройки',
			type:      'button',
			isActive:  this.state.expanded,
			onClick:   this.rollOptionsBlock
		};
		
		return (
			<main className="shortener">
				<form className="shortener-form" onSubmit={this.handleFormSubmit}>
					<div className={`shortener-form-urlField ${this.state.fullURLAnimation}`}>
						<input {...fullURLAttrs} />
						<CogButton {...cogAttrs} />
					</div>
					<div className={`shortener-form-optionsWrapper ${(this.state.expanded ? ' shortener-form-optionsWrapper_expanded' : '')}`}>
  					<div className="shortener-form-options">
							<div className={this.state.shortURLAnimation}>
  							<span className="noselect">alo.life/</span>
								<input {...shortURLAttrs} />
							</div>
						</div>
					</div>
					<Button text="Сократить" width="200px" height="50px" type="submit" noValidate={true} />
				</form>
				<ResultMessage url={this.state.result} />
			</main>
		);
	}
}
