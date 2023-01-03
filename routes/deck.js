const express = require('express');
const router = express.Router();

module.exports = ({
  getDecks
}) => {

  router.get('/', (req, res) => {
    getDecks()
      .then((decks) => {
        res
          .status(200)
          .json(decks);
      })
      .catch((err) => res.json({
        error: err.message
      }));
  });

  return router;
};
