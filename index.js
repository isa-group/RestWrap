const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./api/router');

require("dotenv").config();

app.use(express.json());
app.use(cors());


app.use('/api/v1', router);

app.listen(process.env.EXPRESS_PORT, function() {
    console.log("App running at http://localhost:" + process.env.EXPRESS_PORT);
    console.log("________________________________________________________________");
});