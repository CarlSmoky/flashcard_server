const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const db = require('./db');
const dbHelpers = require('./helpers/dbHelpers')(db);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const cardRouter = require('./routes/card');
const DeckRouter = require('./routes/deck');
const UserRouter = require('./routes/user');
const StatRouter = require('./routes/stat');

app.use('/api/card', cardRouter(dbHelpers));
app.use('/api/deck', DeckRouter(dbHelpers));
app.use('/api/user', UserRouter(dbHelpers));
app.use('/api/stat', StatRouter(dbHelpers));

const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send("This is flashcard back-end");
});

app.listen(port, (req, res) => {
  console.log(`I'm listening ${port}`);
})

module.exports = app;