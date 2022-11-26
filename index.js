const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const Filestore = require('session-file-store')(session);
const flash = require('express-flash');
const conn = require('./db/conn');
const Thought = require('./models/Thought');
const User = require('./models/User');
const thougtRouter = require('./routes/thoughtRoutes');
const authRouter = require('./routes/authRoutes');
const ThoughtController = require('./controllers/ThoughtController');
const port = 3000;
const app = express();

app.engine('handlebars', exphbs.engine());
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
            maxAge: 3600000,
            expires: new Date(Date.now() + 3600000),
            httpOnly: true //pra localhost, precisaria de mais config pra https
        }
    })
);
app.use(flash());
app.use(express.static('public'));

app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session;
    }
    next();
});

app.use('/thoughts', thougtRouter);
app.use('/', authRouter);
app.get('/', ThoughtController.showAll);

conn
    .sync()
    //.sync({ force: true }) // pra quando precisa mudar as tabelas
    .then(() => {
        console.log(`ounvindo porta ${port}`);
        app.listen(port);
    })
    .catch((err) => {
        console.log(err);
    });