const express = require('express');
const router = express.Router();

module.exports = ({
  getDecks,
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

  router.post('/create/', async (req, res) => {
    const { newDeckContents, newCardContents } = req.body;
  
    try {
      let id = await addDeck(newDeckContents.deckName, newDeckContents.description, 1);
      console.log("id",id);
      
      // let something = await addCards(newCardContents);
      res
        .status(200)
        .json(id);
    } catch(err) {
      res.json({
        error: err.message
      })
    }
  });

  return router;
};
