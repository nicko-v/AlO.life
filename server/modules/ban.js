'use strict';

class Ban {
	constructor(time) {
		this._time  = time;
		this._users = new Set();
	}
	
	isBanned(ip) {
		if (this._users.has(ip)) {
			return true;
		} else {
			this._users.add(ip);
			setTimeout( () => { this._users.delete(ip); }, this._time );
			
			return false;
		}
	}
}

module.exports = Ban;
