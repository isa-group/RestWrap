const axios = require('axios');

module.exports.getAll = (req, res) => {
    res.send({message: "All Ok"});
}

module.exports.get = (req, res) => {
    res.send({message: "1 Ok"});
}