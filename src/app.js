// api's,middleware,server instance create
const express = require('express');
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.json()); // helps to read req.body data
app.use(cookieParser());

const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const transactionRouter = require('./routes/transaction.routes')

app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/transaction',transactionRouter) // for unique idempotency key we use uuid in postman

module.exports = app;