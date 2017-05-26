import styles    from '../css/shortener.css';
import React     from 'react';
import Button    from './Button.jsx'
import CogButton from './CogButton.jsx'


export default class Shortener extends React.Component {
	constructor() {
		super();
		
		this.state = {
			showOptions: false
		};
		
		this.handleCogButtonClick = this.handleCogButtonClick.bind(this);
	}
	
	componentDidMount() {
		document.title = 'AlO.life | Сокращение ссылок';
	}
	
	handleCogButtonClick() {
		this.setState({ showOptions: !this.state.showOptions });
	}
	
	handleButtonClick() {
		
	}
	
	render() {
		return (
			<main className="shortener">
				<div className="shortener-urlField">
					<input type="text" className="shortener-urlField-input" placeholder="Укажите ссылку" />
					<CogButton title="Настройки" style={{ color: this.state.showOptions ? '#555' : '', fontSize: '35px'}} onClick={this.handleCogButtonClick} />
				</div>
				<div className="shortener-optionsWrapper" style={{ height: this.state.showOptions ? '150px' : 0 }}>
  				<div className="shortener-options">
						<div>
  						<span className="noselect">alo.life/</span>
							<input type="text" className="shortener-options-input" />
						</div>
					</div>
				</div>
				<Button text="Сократить" width="200px" height="50px" onClick={this.handleButtonClick} />
			</main>
		);
	}
}