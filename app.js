const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const connectTheDatabase = require('./database/mongooseDB');
const router = require("./habitRoutes/routes");

const app = express();
app.use(express.json());

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));


connectTheDatabase();
app.use(router);

app.listen(8800, ()=>{
    console.log("app is running");
})