import React        from 'react';
import ButtonRect   from '../button-rect/index.jsx'
import Message      from './message.jsx';
import OptionsBlock from './options-block.jsx';
import UrlField     from './url-field.jsx';


const Shortener = ({ url, alias, error, result, handleInputChange, isSpoilerExpanded, toggleSpoiler, handleFormSubmit, urlInputAnimation, aliasInputAnimation }) =>
	<main className="shortener">
		<form className="shortener-form" onSubmit={handleFormSubmit}>
			<UrlField animation={urlInputAnimation} url={url} inputHandler={handleInputChange} isSpoilerExpanded={isSpoilerExpanded} toggleSpoiler={toggleSpoiler} />
			<OptionsBlock animation={aliasInputAnimation} alias={alias} inputHandler={handleInputChange} isSpoilerExpanded={isSpoilerExpanded} />
			<ButtonRect text="Сократить" width="200px" height="50px" fontSize="20px" type="submit" />
		</form>
		<Message result={result} error={error} />
	</main>;


export default Shortener;