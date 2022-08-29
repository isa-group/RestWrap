const express = require('express');
const router = express.Router();

const service = require('./service');

router.get('/', (req, res) => {
    service.getHW(req, res);
});

/*
router.get('/service/all', (req, res) => {
    service.getAll(req, res);
});
*/

router.get('/service/:service', (req, res) => {
    service.get(req, res);
});

module.exports = router;