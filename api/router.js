const express = require('express');
const router = express.Router();

const service = require('./service');

router.get('/', (req, res) => {
    service.getHW(req, res);
});

router.get('/service/*', (req, res) => {
    service.get(req, res);
});

router.get('/repositories/:user', (req, res) => {
    service.getRepositories(req, res);
});

router.get('/data/:username/:repository', (req, res) => {
    service.getRepoContent(req, res);
});

router.post('/content', (req, res) => {
    service.getAnyContent(req, res);
});

router.get('/stats/*', (req, res) => {
    service.apiStats(req, res);
});

router.post('/repositoryStats/*', (req, res) => {
    service.repositoryStats(req, res);
});


module.exports = router;