'use strict';

const bodyParser = require('body-parser');
const router     = require('express').Router();
const index      = require('../controllers/index.controller.js');
const login      = require('../controllers/login.controller.js');
const eventsList = require('../controllers/events-list.controller.js');
const shortenUrl = require('../controllers/shorten-url.controller.js');
const unshortUrl = require('../controllers/unshort-url.controller.js');


router.get('/x/events-list', eventsList);
router.get('/s/login', login);
router.get(/^\/(\w|-|%)+(\/?)$/, unshortUrl);
router.get('*', index);

router.post('/x/shorten-url', bodyParser.json(), shortenUrl);


module.exports = router;