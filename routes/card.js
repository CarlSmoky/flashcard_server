const express = require('express');
const router = express.Router();

module.exports = ({
  getCards,
  getDeckById,
  getCardsByDeckID
}) => {

  router.get('/', async (req, res) => {
    try {
      const cards = await getCards();
      res
        .status(200)
        .json(cards);
    } catch (err) {
      res
        .status(409)
        .json({
          error: err.message
        })
    }
  });

  router.get('/deck/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const all = await Promise.all([getDeckById(id), getCardsByDeckID(id)]);

      const deck = all[0];
      const cards = all[1];
      const setOfCardsByDeck = {
        deck,
        cards
      }
      res
        .status(200)
        .json(setOfCardsByDeck);
    } catch (err) {
      res
        .status(409)
        .json({
          error: err.message
        })
    }
  });

  return router;
};
