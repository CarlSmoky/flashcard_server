const express = require('express');
const router = express.Router();

module.exports = ({
  getCards,
  getDeckById,
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
    Promise.all([getDeckById(id), getCardsByDeckID(id)])
      .then((all) => {
        const deck = all[0];
        const cards = all[1];
        const setOfCardsByDeck = {
          deckName: deck.deck_name,
          cards
        }
        res
          .status(200)
          .json(setOfCardsByDeck);
      })
      .catch((err) => res.json({
        error: err.message
      }));
  });

  return router;
};
