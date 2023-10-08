const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./utils/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const Premium = require('./models/order')

const signupRoutes = require('./routes/signup')
const loginRoutes = require('./routes/login');
const expenseRoutes = require('./routes/expense');
const premiumRoutes = require('./routes/premium')

const app = express();

app.use(bodyParser.json({extended: false}));
app.use(cors());
app.use(signupRoutes);
app.use(loginRoutes);
app.use(expenseRoutes);
app.use(premiumRoutes);

User.hasOne(Expense);
User.hasOne(Premium)


sequelize
    // .sync({force:true})
    .sync()
    .then(res =>{
        app.listen(5000,()=>{
            console.log('connected');
        })
    });
