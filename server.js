const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./mydb.db' , (err) => {if(err)console.log(err);});
require('dotenv').config()
const app = express();
const authRoute = require('./Route/authRoute.js')
const surveyRoute = require('./Route/surveyRoute')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/auth' , authRoute);
app.use('/survey' , surveyRoute);


const port = process.env.PORT;

app.listen(port , function(){
    console.log(`server runnning on ${port}`);
})