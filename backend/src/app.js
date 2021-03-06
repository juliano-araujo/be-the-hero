const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');

const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(routes);

app.use(errors());

module.exports = app;
