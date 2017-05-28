import styles    from '../css/shortener.css';
import React     from 'react';
import Button    from './Button.jsx'
import CogButton from './CogButton.jsx'


export default class Shortener extends React.Component {
	constructor() {
		super();
		
		this.state = {
			expanded: false
		};
		
		this.rollOptionsBlock = this.rollOptionsBlock.bind(this);
	}
	
	componentDidMount() {
		document.title = 'AlO.life | Сокращение ссылок';
	}
	
	rollOptionsBlock() {
		this.setState({ expanded: !this.state.expanded });
	}
	
	handleButtonClick() {
		
	}
	
	render() {
		return (
			<main className="shortener">
				<div className="shortener-urlField">
					<input type="text" className="shortener-urlField-input" placeholder="Укажите ссылку" />
					<CogButton title="Настройки" className="shortener-urlField-cog" isActive={this.state.expanded} onClick={this.rollOptionsBlock} />
				</div>
				<div className={`shortener-optionsWrapper ${(this.state.expanded ? ' shortener-optionsWrapper_expanded' : '')}`}>
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