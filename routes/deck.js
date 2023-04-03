const express = require('express');
const router = express.Router();

module.exports = ({
  getDecks,
  addDeck,
  addCards
}) => {

  router.get('/', async (req, res) => {
    try {
      const decks = await getDecks();
      res
        .status(200)
        .json(decks);
    } catch(err) {
      res
        .status(409)
        .json({
        error: err.message
        })
    }
  });

  router.post('/create/', async (req, res) => {
    const { newDeckContents, newCardContents } = req.body;
    const tempUserId = 1;
    try {
      const deckResult = await addDeck(newDeckContents.deckName, newDeckContents.description, tempUserId);
      if (!deckResult) {
        throw new Error(`This title already exists.`);
      }
      const cardsResult = await addCards(newCardContents, deckResult.id);
      const numOfData = cardsResult.length;
      
      res
        .status(200)
        .json({
          deckName: deckResult.deck_name,
          numOfCards: numOfData
        });
    } catch(err) {
      res
        .status(409)
        .json({
        error: err.message
        })
    }
  });

  return router;
};
