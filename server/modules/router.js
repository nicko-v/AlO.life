'use strict';

const bodyParser = require('body-parser');
const router     = require('express').Router();
const index      = require('../controllers/index.controller.js');
const login      = require('../controllers/login.controller.js');
const eventsList = require('../controllers/events-list.controller.js');
const shortenUrl = require('../controllers/shorten-url.controller.js');
const unshortUrl = require('../controllers/unshort-url.controller.js');
const users      = require('../controllers/users.controller.js');


router.get('/x/events-list', eventsList);
router.get('/x/users', users);
router.get('/s/login', login);
router.get(/^\/(\w|-|%)+(\/?)$/, unshortUrl);
router.get('*', index);

router.post('/x/shorten-url', bodyParser.json(), shortenUrl);
router.post('/x/users', bodyParser.json(), users);


module.exports = router;