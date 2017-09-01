import React     from 'react';
import ButtonCog from '../button-cog/index.jsx'


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
};

const ShortenerUrlField = ({ animation, url, inputHandler, isSpoilerExpanded, toggleSpoiler }) =>
	<div className={`shortener-form-urlField ${animation}`}>
		<input value={url} onChange={inputHandler} {...urlAttrs} />
		<ButtonCog isActive={isSpoilerExpanded} onClick={toggleSpoiler} {...cogAttrs} />
	</div>;
	
	
export default ShortenerUrlField;