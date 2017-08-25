import React     from 'react';
import CogButton from './cog-button.jsx'


const urlAttrs = {
	className:    'shortener-form-urlField-input',
	autoComplete: 'off',
	placeholder:  'Укажите ссылку',
	title:        'Сокращаемый адрес',
	type:         'url', // С таким типом будет появляться кнопка подстановки домена на мобильных устройствах. Хотя навряд ли кто-то будет писать ссылки вручную.
	name:         'url',
	spellCheck:   false,
	autoFocus:    true,
};
const cogAttrs = {
	className: 'shortener-form-urlField-cog',
	title:     'Настройки',
	type:      'button',
};

const ShortenerUrlField = ({ animation, url, inputHandler, isSpoilerExpanded, toggleSpoiler }) =>
	<div className={`shortener-form-urlField ${animation}`}>
		<input value={url} onChange={inputHandler} {...urlAttrs} />
		<CogButton isActive={isSpoilerExpanded} onClick={toggleSpoiler} {...cogAttrs} />
	</div>;
	
	
export default ShortenerUrlField;