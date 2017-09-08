import React  from 'react';


const Search = ({ handleSearchChange }) =>
	<div className="timeline-controls-search noselect">
		<p className="timeline-controls-name">Искать:</p>
		<input className="timeline-controls-search-input" type="text" onChange={handleSearchChange} />
	</div>;


export default Search;