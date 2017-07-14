import styles    from '../css/shortener.css';
import React     from 'react';
import Button    from './Button.jsx'
import CogButton from './CogButton.jsx'


function Message(props) {
	if (props.result.length) {
		return (
			<div className="shortener-message">
				<p className="shortener-message-header-success noselect animated fadeIn">Ссылка сокращена:</p>
				<div className="shortener-message-content">
					{ props.result.map( (url, index) => <a className="animated fadeInRight" href={url} target="_blank" key={index}>{url.replace(/^http(s)?:\/\//, '')}</a> ) }
				</div>
			</div>
		);
	}
	if (props.error.length) {
		return (
			<div className="shortener-message">
				<p className="shortener-message-header-error">{props.error}</p>
			</div>
		);
	}
	return null;
}

export default class Shortener extends React.Component {
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
	
	componentDidMount() {
		document.title = 'AlO.life | Сокращение ссылок';
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
		let xhr = new XMLHttpRequest();
		
		function validateInput(url, alias) {
			/* Изменяется вместе с аналогом на сервере */
			const MAX_URL_LENGTH   = 2000;
			const MIN_URL_LENGTH   = 4;
			const MAX_ALIAS_LENGTH = 50;
			const MIN_ALIAS_LENGTH = 4;
			/* -=-=-=- */
			
			let urlRegexp   = new RegExp('^([\\w\\-]+?\\.?)+?\\.[\\w\\-]+?$');
			let aliasRegexp = new RegExp('(^$)|(^[-\\wА-Яа-яёЁ]+?$)');
			
			function WrongInput(where, message) {
				this.name = 'WrongInput';
				this.message = message;
				this.where = where;
			}
			function wordEnding(num) {
				return num.toString().search(/(11|12|13|14|0|[5-9])$/) > -1 ? 'ов' : num.toString().search(/1$/) > -1 ? '' : 'а';
			}
			
			
			// Проверка наличия точки отсеивает "проверочный" ввод одних цифр (1111, 1234), который пройдет валидацию,
			// т.к. цифры преобразовываются элементом <a> к IP адресу, например: a.href = http://123; a.hostname === 0.0.0.123;
			if (url.length < MIN_URL_LENGTH ||
			    url.indexOf('.') === -1)     { throw new WrongInput('url', 'Некорректная ссылка.'); }
			if (url.length > MAX_URL_LENGTH) { throw new WrongInput('url', `Длина ссылки не должна превышать ${MAX_URL_LENGTH} символ${wordEnding(MAX_URL_LENGTH)}.`); }
			
			if (alias.length > MAX_ALIAS_LENGTH ||
			   (alias.length > 0 && alias.length < MIN_ALIAS_LENGTH)) { throw new WrongInput('alias', `Длина названия должна быть от ${MIN_ALIAS_LENGTH} до ${MAX_ALIAS_LENGTH} символ${wordEnding(MAX_ALIAS_LENGTH)}.`); }
			if (!aliasRegexp.test(alias))                             { throw new WrongInput('alias', 'Некорректное название. Допустимы символы A-z, А-я, 0-9, -, _'); }
			
			
			// Добавление протокола для создания корректной ссылки через элемент <a>:
			if (url.search(/^(ftp|http|https):\/\//) === -1) { url = 'http://' + url; }
			
			// Свойство hostname элемента <a> содержит имя хоста без протокола, порта и пути, кодированное в punycode, что упрощает проверку:
			let a = document.createElement('a');
			a.href = url;
			if (a.hostname.length < 4 ||
			    a.hostname.length > 255 ||
			    a.hostname === window.location.hostname ||
			    !urlRegexp.test(a.hostname)) {
				throw new WrongInput('url', 'Некорректная ссылка.');
			}
		}
		
		
		event.preventDefault();
		
		xhr.addEventListener('readystatechange', () => {
			if (xhr.readyState != 4) { return; }
			try {
				if (xhr.status == 200 && xhr.responseText.length) {
					let urls = this.state.result.slice();
					urls.push(xhr.responseText);
					this.setState({ url: '', alias: '', urlWrongInputs: 0, aliasWrongInputs: 0, error: '', result: urls });
				} else {
					throw new Error(xhr.responseText);
				}
			} catch (error) {
				this.shakeField(error.where);
				this.setState({ result: [], error: error.message });
			}
		});
		
		try {
			validateInput(this.state.url, this.state.alias);
			
			let data = new FormData();
			
			data.append('q', 'shorten_url');
			data.append('url', this.state.url);
			data.append('alias', this.state.alias);
			
			xhr.open('POST', '/xhr');
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.send(data);
		} catch (error) {
			this.shakeField(error.where);
			this.setState({ result: [], error: error.message });
		}
	}
	
	shakeField(field) {
		if (!field) { return; }
		
		clearTimeout(this.state[`${field}AnimationTimeout`]);
		this.setState({
			[`${field}WrongInputs`]: this.state[`${field}WrongInputs`] += 1,
			[`${field}InputAnimation`]: `animated ${this.state[`${field}WrongInputs`] >= 10 ? 'tada' : 'shake'}`,
			[`${field}AnimationTimeout`]: setTimeout( () => this.setState({ [`${field}InputAnimation`]: '' }), 1000 )
		});
	}
	
	render() {
		let urlAttrs = {
			className:    'shortener-form-urlField-input',
			autoComplete: 'off',
			placeholder:  'Укажите ссылку',
			title:        'Сокращаемый адрес',
			type:         'url', // С таким типом будет появляться кнопка подстановки домена на мобильных устройствах. Хотя навряд ли кто-то будет писать ссылки вручную.
			name:         'url',
			spellCheck:   false,
			autoFocus:    true,
			value:        this.state.url,
			onChange:     this.handleInputChange
		};
		let aliasAttrs = {
			className:    'shortener-form-options-input',
			autoComplete: 'off',
			title:        'Желаемый адрес (необязательно). От 4 до 50 символов: A-z, А-я, 0-9, -, _',
			type:         'text',
			name:         'alias',
			spellCheck:   'false',
			value:        this.state.alias,
			onChange:     this.handleInputChange,
		};
		let cogAttrs = {
			className: 'shortener-form-urlField-cog',
			title:     'Настройки',
			type:      'button',
			isActive:  this.state.isSpoilerExpanded,
			onClick:   this.toggleSpoiler
		};
		let shortenAttrs = {
			text:       'Сократить',
			width:      '200px',
			height:     '50px',
			type:       'submit',
			noValidate: true
		};
		
		return (
			<main className="shortener">
				<form className="shortener-form" onSubmit={this.handleFormSubmit}>
					<div className={`shortener-form-urlField ${this.state.urlInputAnimation}`}>
						<input {...urlAttrs} />
						<CogButton {...cogAttrs} />
					</div>
					<div className={`shortener-form-optionsWrapper ${(this.state.isSpoilerExpanded ? ' shortener-form-optionsWrapper_expanded' : '')}`}>
  					<div className="shortener-form-options">
							<div className={this.state.aliasInputAnimation}>
  							<span className="noselect">alo.life/</span>
								<input {...aliasAttrs} />
							</div>
						</div>
					</div>
					<Button {...shortenAttrs} />
				</form>
				<Message error={this.state.error} result={this.state.result} />
			</main>
		);
	}
}