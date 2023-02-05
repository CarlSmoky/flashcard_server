const express = require('express');
const router = express.Router();

module.exports = ({
  getCards,
  getCardsByDeckID
}) => {

  router.get('/', (req, res) => {
    getCards()
      .then((cards) => {
        res
          .status(200)
          .json(cards);
      })
      .catch((err) => res.json({
        error: err.message
      }));
  });

  router.get('/deck/:id', (req, res) => {
    const id = req.params.id;
    getCardsByDeckID(id)
      .then((cards) => {
        res
          .status(200)
          .json(cards);
      })
      .catch((err) => res.json({
        error: err.message
      }));
  });

  return router;
};
