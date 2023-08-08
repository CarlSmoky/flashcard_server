const express = require('express');
const router = express.Router();

module.exports = ({
  getDecks,
  addDeck,
  addCards,
  updateCards,
  deleteCards,
  updateDeck
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

  router.post('/update/:id', async (req, res) => {
    const deckId = req.params.id;
    const { updateDeckData, createdCardsData, updateCardsData, deleteCardsData } = req.body;
    
    try {
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
         numOfupdatedCard: updateCardsResult.length
         }
       }
       if (createdCardsResult) {
        results = {...results,
         numOfcreatedCard: createdCardsResult.length
         }
       }
       if (deleteCardsResult) {
        results = {...results,
         numOfDeletedCards: deleteCardsResult.length
         }
       }
      console.log(results)
      
      res
        .status(200)
        .json(
          results
        );
    } catch(err) {
      console.log("Error in Post----!")
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
