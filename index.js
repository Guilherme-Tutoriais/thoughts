const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const Filestore = require('session-file-store')(session);
const flash = require('express-flash');
const conn = require('./db/conn');
const port = 3000;
const app = express();

app.engine = ('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new Filestore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true //pra localhost, precisaria de mais config pra https
        }
    })
);
app.use(flash());
app.use(express.static('public'));

app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.sessions = req.session;
    }
    next();
});

conn
    .sync()
    .then(() => {
        app.listen(port);
    })
    .catch((err) => {
        console.log(err);
    });