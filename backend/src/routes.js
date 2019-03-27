"use strict";
const router = require('koa-router')();
const controller = require('./controller');

router.post('/upload', controller.uploadFile);
router.post('/copy', controller.copyFolder)

module.exports = router;