const express = require('express');
const router = express.Router();

module.exports = ({
  getDecks,
  getDeckById
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

  router.get('/:id', (req, res) => {
    const id = req.params.id;
    getDeckById(id)
      .then((deck) => {
        res
          .status(200)
          .json(deck);
      })
      .catch((err) => res.json({
        error: err.message
      }));
  });

  return router;
};
