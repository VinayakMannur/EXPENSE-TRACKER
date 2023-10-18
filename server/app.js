const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path');
const fileUpload = require('express-fileupload')

require('dotenv').config()

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

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

app.use(bodyParser.json({extended: false}));
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
  })
);
app.use(compression())
app.use(morgan('combined', {stream: accessLogStream}))
app.use(fileUpload())

const _dirname = path.dirname("ExpenseTracker")
const reactPath = path.join(_dirname,'../client/build')

app.use(express.static(reactPath))

app.get('/',(req,res)=>{
    res.sendFile(
        path.join(__dirname,"../client/build/index.html"),(err)=>{
            if(err){
                res.status(500).send(err)
            }
        }
    )
})

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
        app.listen(process.env.PORT || 5000,()=>{
            console.log('Avengers assemble at PORT 5000');
        })
    });
