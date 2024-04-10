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
  updateDeck,
  getOwerOfDeck
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
      const cardsResult = await addCards(newCardContents, deckResult.id);
      const numOfData = cardsResult.length;
      
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
      const userId = await getOwerOfDeck(deckId);
      if (auth0UserId !== userId.user_id) {
        throw new Error(`User doesn't match. Only deck owner can change their decks and cards.`);
      }
      let deckResult;
      if (updateDeckData !== null) {
        deckResult = await updateDeck(updateDeckData.id, updateDeckData.deckName, updateDeckData.description);
      }
      let updateCardsResult;
      if (updateCardsData.length !== 0) {
        updateCardsResult = await updateCards(updateCardsData);
      }
      let createdCardsResult;
      if (createdCardsData.length !== 0) {
        createdCardsResult = await addCards(createdCardsData, deckId);
      }
      let deleteCardsResult;
      if (deleteCardsData.length !== 0) {
        deleteCardsResult = await deleteCards(deleteCardsData);
      }
      let results = {};
      if (deckResult) {
       results = {...results,
        updateDeckName: deckResult.deck_name,
        updateDescription: deckResult.description
        }
      }
      if (updateCardsResult) {
        results = {...results,
         numOfUpdatedCard: updateCardsResult.length
         }
       }
       if (createdCardsResult) {
        results = {...results,
         numOfCreatedCard: createdCardsResult.length
         }
       }
       if (deleteCardsResult) {
        results = {...results,
         numOfDeletedCards: deleteCardsResult.length
         }
       }
      
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
