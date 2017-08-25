'use strict';

const paths = require('../config/paths.js');


function index(req, res) { res.sendFile(paths.index); }


module.exports = index;
