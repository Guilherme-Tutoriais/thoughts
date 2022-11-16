const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const Filestore = require('session-file-store')(session);
const flash = require('express-flash');
const port = 3000;

const app = express();

const conn = require('./db/conn');

conn
    .sync()
    .then(() => {
        app.listen(port);
    })
    .catch((err) => {
        console.log(err);
    });