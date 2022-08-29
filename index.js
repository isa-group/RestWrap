const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./api/router');

require("dotenv").config();

app.use(express.json());
app.use(cors());


app.use('/api/v1', router);

const port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log("App running at http://localhost:" + port);
    console.log("________________________________________________________________");
});