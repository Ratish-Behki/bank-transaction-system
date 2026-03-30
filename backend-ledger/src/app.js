// api's,middleware,server instance create
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors")

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://bank-transaction-frontend.onrender.com"
  ],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json()); // helps to read req.body data
app.use(cookieParser());

const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const transactionRouter = require('./routes/transaction.routes')

app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/transaction',transactionRouter) // for unique idempotency key we use uuid in postman

module.exports = app;