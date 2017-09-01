import React from 'react';


const aliasAttrs = {
	className:    'shortener-form-options-input',
	autoComplete: 'off',
	title:        'Желаемый адрес (необязательно). От 4 до 50 символов: A-z, А-я, 0-9, -, _',
	type:         'text',
	name:         'alias',
	spellCheck:   'false',
};

const ShortenerOptionsBlock = ({ alias, inputHandler, isSpoilerExpanded, animation }) =>
	<div className={`shortener-form-optionsWrapper ${(isSpoilerExpanded ? ' shortener-form-optionsWrapper_expanded' : '')}`}>
  	<div className="shortener-form-options">
			<div className={animation}>
  			<span className="noselect">alo.life/</span>
				<input value={alias} onChange={inputHandler} {...aliasAttrs} />
			</div>
		</div>
	</div>;


export default ShortenerOptionsBlock;