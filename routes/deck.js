const express = require('express');
const router = express.Router();
const {
  validateAccessToken,
} = require("../middleware/auth0.middleware.js");

module.exports = ({
  getDecks,
  addDeck,
  addCards,
  updateCards,
  deleteCards,
  deleteAllCardsByDeckId,
  updateDeck,
  deleteDeck,
  getOwerOfDeckId
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

  router.post('/create/', validateAccessToken, async (req, res) => {
    const { newDeckContents, newCardContents } = req.body;
    const userId = req.auth.payload.sub;
    try {
      const deckResult = await addDeck(newDeckContents.deckName, newDeckContents.description, userId);
      if (!deckResult) {
        throw new Error(`This title already exists.`);
      }
      const {data, error} = await addCards(newCardContents, deckResult.id);
      let numOfData = []
      if (data) {
        numOfData = data.length;
      }

      if(error) {
        throw new Error("Failed to add cards!");
      }
      
      res
        .status(200)
        .json({
          deckId : deckResult.id,
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

  router.post('/update/:id', validateAccessToken, async (req, res) => {
    const deckId = req.params.id;
    const auth0UserId = req.auth.payload.sub;
    const { updateDeckData, createdCardsData, updateCardsData, deleteCardsData } = req.body;
    
    try {
      const userId = await getOwerOfDeckId(deckId);
      if (auth0UserId !== userId.user_id) {
        throw new Error(`User doesn't match. Only deck owner can change their decks and cards.`);
      }

      let promiseArr = [];
      let targetFunctions = [];
      if (updateDeckData !== null) {
        promiseArr = [...promiseArr, updateDeck(updateDeckData.id, updateDeckData.deckName, updateDeckData.description)];
        targetFunctions = [...targetFunctions, "updateDeck"];
      }

      if (updateCardsData.length !== 0) {
        promiseArr = [...promiseArr, updateCards(updateCardsData)];
        targetFunctions = [...targetFunctions, "updateCards"];
      }

      if (createdCardsData.length !== 0) {
        promiseArr = [...promiseArr, addCards(createdCardsData, deckId)];
        targetFunctions = [...targetFunctions, "addCards"];
      }

      if (deleteCardsData.length !== 0) {
        promiseArr = [...promiseArr, deleteCards(deleteCardsData)];
        targetFunctions = [...targetFunctions, "deleteCards"];
      }

      const results = await Promise.all(promiseArr);

      const getErrorOccuredFunctions = results => {
        let functions = [];
        results.forEach(({data, error}, i) => {
          if (!!error) {
            functions = [...functions, targetFunctions[i]];
          }
        })
        return functions;
      }

      const errorItem = getErrorOccuredFunctions(results);
      if(errorItem.length > 0) {
        // Need to add roleback
        throw new Error(`Error occurs in: ${[...errorItem]}` );
      }

      res
        .status(200)
        .json(
          results
        );
    } catch(err) {
      res
      // Status code need to be evaluate.
        .status(403)
        .json({
          error: err.message
        })
    }
  });

  router.post('/delete/:id', validateAccessToken, async (req, res) => {
    const deckId = req.params.id;
    try {
      const results = await Promise.all([deleteDeck(deckId), deleteAllCardsByDeckId(deckId)]);
      
      res
        .status(200)
        .json(
          results
        );
    } catch(err) {
      console.log(err)
      
      res
        .status(409)
        .json({
        error: err.message
        })
    }
  });

  return router;
};
