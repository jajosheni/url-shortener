require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const urlsRouter = require('./routes/urls');

const app = express();

mongoose.connect(
    process.env.MONGODB_URI,
    {useNewUrlParser: true, useUnifiedTopology: true}
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/', urlsRouter);

module.exports = app;
