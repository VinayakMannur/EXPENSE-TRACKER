const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');
const signupRoutes = require('./routes/signup')

const app = express();

app.use(bodyParser.json({extended: false}));
app.use(cors());
app.use(signupRoutes)

sequelize
    .sync()
    .then(res =>{
        app.listen(5000,()=>{
            console.log('connected');
        })
    });
