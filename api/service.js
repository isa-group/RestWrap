const axios = require('axios');
require("dotenv").config();

const YAML = require('yaml')

authorization_token=process.env.ACCESS_TOKEN;
api_url = 'https://api.github.com/repos/';

module.exports.getHW = (req, res) => {
    res.send({message: "This is my Restwrap API!", data: null});
}

/*
module.exports.getAll = (req, res) => {
    axios.get(api_url, {headers: {Authorization: authorization_token}})
    .then(response => {
        response.data = response.data.map(async function (x) {
            axios.get(x.url, {headers: {Authorization: authorization_token}})
            .then(response2 => {
                let buff = Buffer(response2.data.content, response2.data.encoding);
                let text = buff.toString('ascii');
                response2.data.content = YAML.parse(text);
                return response2.data;
            })
            .catch(error => {
                console.log(error);
            });
        })
        res.send({message: "All Ok", data: response.data});
    })
    .catch(error => {
        console.log(error);
        res.send({message: "Error", data: error});
    });
}
*/

module.exports.get = (req, res) => {
    let destPath = req.originalUrl.split("/service/")[1];
    axios.get(api_url+destPath, {headers: {Authorization: authorization_token}})
    .then(response => {
        let buff = Buffer(response.data.content, response.data.encoding);
        let text = buff.toString('ascii');
        response.data.content = YAML.parse(text);
        res.send({message: "1 Ok", data: response.data});
    })
    .catch(error => {
        console.log(error);
        res.send({message: "Error", data: error});
    });
}