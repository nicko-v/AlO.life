'use strict';

class WrongInput {
	constructor(where, message) {
		this.name    = 'WrongInput';
		this.where   = where;
		this.message = message;
	}
}

module.exports = WrongInput;