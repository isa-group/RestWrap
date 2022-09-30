const axios = require('axios');
require("dotenv").config();

const YAML = require('yaml')

authorization_token=process.env.ACCESS_TOKEN;
api_url_data = 'https://api.github.com/repos/';
api_url_org = 'https://api.github.com/orgs/username/repos';
api_url_user = 'https://api.github.com/users/username/repos';

module.exports.getHW = (req, res) => {
    res.send({message: "This is the RestWrap API!", data: null});
}

module.exports.get = (req, res) => {
    let destPath = req.originalUrl.split("/service/")[1];
    axios.get(api_url_data+destPath, {headers: {Authorization: authorization_token}})
    .then(response => {
        let buff = Buffer(response.data.content, response.data.encoding);
        let text = buff.toString('ascii');
        response.data.content = YAML.parse(text);
        res.send({message: "200 Ok", data: response.data});
    })
    .catch(error => {
        console.log(error);
        res.send({message: "Error", data: error});
    });
}

module.exports.getRepositories = (req, res) => {
    let username = req.params.user;
    axios.get(api_url_org.replace("username", username), {headers: {Authorization: authorization_token}})
    .then(response => {
        res.send({message: "200 Ok", data: response.data});
    }
    )
    .catch(error => {
        console.log(api_url_user.replace("username", username));
        axios.get(api_url_user.replace("username", username), {headers: {Authorization: authorization_token}})
        .then(response => {
            res.send({message: "200 Ok", data: response.data});
        }
        )
        .catch(error => {
            console.log(error);
            res.send({message: "Error", data: error});
        });
    });
}

module.exports.getRepoContent = (req, res) => {
    let username = req.params.username;
    let repository = req.params.repository;
    axios.get(`${api_url_data}${username}/${repository}/contents/`, {headers: {Authorization: authorization_token}})
    .then(response => {
        res.send({message: "200 Ok", data: response.data});
    })
    .catch(error => {
        console.log(error);
        res.send({message: "Error", data: error});
    });
}