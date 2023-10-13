const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./utils/database');

const User = require('./models/user');
const Expense = require('./models/expense');
const Premium = require('./models/order')
const ForgotPasswordRequests = require('./models/forgotPasswordRequests');
const Income = require('./models/income');
const Download = require('./models/download');

const signupRoutes = require('./routes/signup')
const loginRoutes = require('./routes/login');
const expenseRoutes = require('./routes/expense');
const premiumRoutes = require('./routes/premium')
const forgotPasswordRoutes = require('./routes/forgotpassword')
const incomeRoutes = require('./routes/income');
const reportRoutes = require('./routes/report')

const app = express();

app.use(bodyParser.json({extended: false}));
app.use(cors());

app.use(signupRoutes);
app.use(loginRoutes);
app.use(expenseRoutes);
app.use(premiumRoutes);
app.use(forgotPasswordRoutes);
app.use(incomeRoutes);
app.use(reportRoutes);

User.hasOne(Expense);
User.hasOne(Income);
User.hasOne(Premium);
User.hasOne(Download);
User.hasMany(ForgotPasswordRequests);

sequelize
    // .sync({force:true})
    .sync()
    .then(res =>{
        app.listen(5000,()=>{
            console.log('Avengers assemble at PORT 5000');
        })
    });
