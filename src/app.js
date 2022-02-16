const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')});
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const bodyParser = require("body-parser");
const http = require("http").Server(app);

require("./db.js");
require("./cryptoData");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/quiz", require("./routes/quiz"));
app.use("/result", require("./routes/result"));

http.listen(port, () => {
    console.log(`App listening at Port ${port}`);
})