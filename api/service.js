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
    axios.get(api_url_data+destPath, {"headers": {"Authorization": `Token ${authorization_token}`}})
    .then(response => {
        let buff = Buffer(response.data.content, response.data.encoding);
        let text = buff.toString('ascii');
        try {
            response.data.content = YAML.parse(text);
        } catch (error) {
            response.data.content = text;
        }
        res.send({message: "200 Ok", data: response.data});
    })
    .catch(error => {
        console.log(error);
        res.send({message: "Error", data: error});
    });
}

module.exports.getRepositories = (req, res) => {
    let username = req.params.user;
    axios.get(api_url_org.replace("username", username), {"headers": {"Authorization": `Token ${authorization_token}`}})
    .then(response => {
        res.send({message: "200 Ok", data: response.data});
    }
    )
    .catch(error => {
        axios.get(api_url_user.replace("username", username), {"headers": {"Authorization": `Token ${authorization_token}`}})
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
    axios.get(`${api_url_data}${username}/${repository}/contents/`, {"headers": {"Authorization": `Token ${authorization_token}`}})
    .then(response => {
        res.send({message: "200 Ok", data: response.data});
    })
    .catch(error => {
        console.log(error);
        res.send({message: "Error", data: error});
    });
}

module.exports.getAnyContent = (req, res) => {
    let url = req.body.url;
    axios.get(url, {"headers": {"Authorization": `Token ${authorization_token}`}})
    .then(response => {
        res.send({message: "200 Ok", data: response.data});
    })
    .catch(error => {
        console.log(error);
        res.send({message: "Error", data: error});
    });
}

module.exports.apiStats = (req, res) => {
    let destPath = req.originalUrl.split("/stats/")[1];
    axios.get(api_url_data+destPath, {"headers": {"Authorization": `Token ${authorization_token}`}})
    .then(response => {
        let buff = Buffer(response.data.content, response.data.encoding);
        let text = buff.toString('ascii');
        try {
            response.data.content = YAML.parse(text);
        } catch (error) {
            response.data.content = text;
        }
        var json_file = response.data.content;

        try {
            var cheapestPlan = `${Object.keys(json_file.plans)[0]}(0)`;
            let price = Number.MAX_SAFE_INTEGER;
            Object.keys(json_file.plans).forEach(plan => {
                if (json_file.plans[plan].pricing.cost < price) {
                    price = json_file.plans[plan].pricing.cost;
                    cheapestPlan = `${plan}(${price})`;
                }
            });
    
            var mostExpensivePlan = `${Object.keys(json_file.plans)[0]}(0)`;
            price = 0;
            Object.keys(json_file.plans).forEach(plan => {
                if (json_file.plans[plan].pricing.cost > price) {
                    price = json_file.plans[plan].pricing.cost;
                    mostExpensivePlan = `${plan}(${price})`;
                }
            });
    
            var stats = {
                "numberOfMetrics": Object.keys(json_file.metrics).length,
                "metricsNames": Object.keys(json_file.metrics),
                "numberOfPlans": Object.keys(json_file.plans).length,
                "cheapestPlan": cheapestPlan,
                "mostExpensivePlan": mostExpensivePlan,
                "plans": json_file.plans,
            }
            res.send({message: "200 Ok", data: stats});
        } catch (error) {
            res.send({message: "This file is not a SLA4OAI file or It is not well created", data: null});
        }
       
    })
    .catch(error => {
        console.log(error);
    });
}

async function getDataFromFiles(element) {
    return axios.get(element.url, {"headers": {"Authorization": `Token ${authorization_token}`}})
    .then(response => {
        let buff = Buffer(response.data.content, response.data.encoding);
        let text = buff.toString('ascii');
        try {
            return YAML.parse(text);
        }
        catch (error) {
            return "API not well created";
        }
    })
    .catch(error => {
        return "API not well created";
    });
}

module.exports.repositoryStats = (req, res) => {
    let user = req.body.user;
    let repo = req.body.repo;
    let path = req.body.path;
    if (path.startsWith("/")) {
        path = path.substring(1);
    }
    axios.get(`${api_url_data}${user}/${repo}/contents/${path}`, {"headers": {"Authorization": `Token ${authorization_token}`}})
    .then(response => {
        let fileList = response.data;
        var list_jsons = [];
        
        fileList.forEach(element => {
            if (element.name.endsWith(".yaml")) {
                const json_file = getDataFromFiles(element);
                list_jsons.push(json_file);
            }
        });

        Promise.all(list_jsons).then(values => {
            var dataResult = [];
            values.forEach(element => {
                if (element != "API not well created") {
                    console.log(element.plans);
                    dataResult.push(element);
                }
            });
            res.send({message: "200 Ok", data: dataResult});
        })
        .catch(error => {
            console.log(error);
        });
        
    })
    .catch(error => {
        console.log(error);
        res.send({message: "Error", data: error});
    });
}