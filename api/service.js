const axios = require('axios');
require("dotenv").config();

authorization_token=process.env.ACCESS_TOKEN;
api_url = 'https://api.github.com/repos/isa-group/datasets/contents/plans/';



module.exports.getAll = (req, res) => {
    axios.get(api_url, {headers: {Authorization: authorization_token}})
    .then(response => {
        console.log(response.data);
        res.send({message: "All Ok", data: response.data});
    })
    .catch(error => {
        console.log(error);
        res.send({message: "Error", data: error});
    });
}

module.exports.get = (req, res) => {
    axios.get(api_url+req.params.service+"-sla4oai.yaml", {headers: {Authorization: authorization_token}})
    .then(response => {
        console.log(response.data);
        res.send({message: "1 Ok", data: response.data});
    })
    .catch(error => {
        console.log(error);
        res.send({message: "Error", data: error});
    });
}