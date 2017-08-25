import React from 'react';


const ShortenerMessage = ({ result, error }) => {
	if (result.length) {
		return (
			<div className="shortener-message">
				<p className="shortener-message-header-success noselect animated fadeIn">Ссылка сокращена:</p>
				<div className="shortener-message-content">
					{ result.map( (url, index) => <a className="animated fadeInRight" href={url} target="_blank" key={index}>{url.replace(/^http(s)?:\/\//, '')}</a> ) }
				</div>
			</div>
		);
	}
	if (error.length) {
		return (
			<div className="shortener-message">
				<p className="shortener-message-header-error">{error}</p>
			</div>
		);
	}
	return null;
};


export default ShortenerMessage;