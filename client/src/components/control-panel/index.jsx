import React from 'react';


const Settings = ({ avatar, nickname, handleFormSubmit }) =>
	<main className="settings">
		<div className="settings-user">
			<img className="settings-user-avatar" src={avatar} alt="Аватар" />
			<p className="settings-user-name">{nickname}</p>
		</div>
		<form className="settings-params" onSubmit={handleFormSubmit}>
			
		</form>
	</main>;


export default Settings;