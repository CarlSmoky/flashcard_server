const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');

const app = express();
const db = require('./db');
const dbHelpers = require('./helpers/dbHelpers')(db);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const cardRouter = require('./routes/card');

app.use('/api/card', cardRouter(dbHelpers));

// let port = process.env.PORT;
// if (port == null || port == '') {
//   port = 8080;
// }

const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send("This is flashcard back-end");
});

app.listen(port, (req, res) => {
  console.log(`I'm listening ${port}`);
})

module.exports = app;