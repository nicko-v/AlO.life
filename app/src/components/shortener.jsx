import styles                from '../css/shortener.css';
import React                 from 'react';
import Button                from './button.jsx'
import CogButton             from './cog-button.jsx'
import ShortenerMessage      from './shortener-message.jsx';
import ShortenerOptionsBlock from './shortener-options-block.jsx';
import ShortenerUrlField     from './shortener-url-field.jsx';


const Shortener = ({ url, alias, error, result, handleInputChange, isSpoilerExpanded, toggleSpoiler, handleFormSubmit, urlInputAnimation, aliasInputAnimation }) =>
	<main className="shortener">
		<form className="shortener-form" onSubmit={handleFormSubmit}>
			<ShortenerUrlField animation={urlInputAnimation} url={url} inputHandler={handleInputChange} isSpoilerExpanded={isSpoilerExpanded} toggleSpoiler={toggleSpoiler} />
			<ShortenerOptionsBlock animation={aliasInputAnimation} alias={alias} inputHandler={handleInputChange} isSpoilerExpanded={isSpoilerExpanded} />
			<Button text={"Сократить"} width={"200px"} height={"50px"} type={"submit"} noValidate={true} />
		</form>
		<ShortenerMessage result={result} error={error} />
	</main>;


export default Shortener;