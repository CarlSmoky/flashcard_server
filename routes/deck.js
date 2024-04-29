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
  deleteCardsByDeckId,
  updateDeck,
  deleteDeck,
  getOwerOfDeckId
}) => {

  router.get('/', async (req, res) => {
    
    try {
      const { data, error } = await getDecks();

      if (error) {
        throw new Error(`Failed to get deck list.` );
      }

      res
        .status(200)
        .json(data);
    } catch(err) {
      res
        .status(400)
        .json({
          error: err.message
        })
    }
  });

  router.post('/create/', validateAccessToken, async (req, res) => {
    const { newDeckContents, newCardContents } = req.body;
    const userId = req.auth.payload.sub;
    try {

      let statusCode = 200;
      const results = {};
      const { data, error } = await addDeck(newDeckContents.deckName, newDeckContents.description, userId);
    
      if (error) {
        throw new Error(`Failed to create deck! error: ${error}`);
      }

      const deckData = data;
      if (deckData) {
        const { data, error } = await addCards(newCardContents, deckData.id);
        
        if (data) {
          results["deckId"] = deckData.id;
          results["numOfData"] = data.length;
        }

        if(error) {
          throw new Error("Failed to add cards!");
        }
      }

      res
        .status(statusCode)
        .json({
          results
        });
    } catch(err) {
      statusCode = err.message.search("duplicate key value") === -1 ? 400 : 409;
      err.message = err.message.search("duplicate key value") === -1 ? "Something went wrong." : "The title has been used. Try other title";
      
      res
        .status(statusCode)
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

      // pass error here like error: value too long for type character varying(255)
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
      // Status code need to be evaluate. Especially title confict
      res
        .status(400)
        .json({
          error: err.message
        })
    }
  });

  router.post('/delete/:id', validateAccessToken, async (req, res) => {
    const deckId = req.params.id;
    if (!deckId) {
      throw new Error("deck id is missing!");
    }

    try {
      const results = await Promise.all([deleteDeck(deckId), deleteCardsByDeckId(deckId)]);

      let success = {};
      if (results[0].data && results[1].data) {
        success["deletedDeckName"] = results[0].data.deck_name;
        success["numOfDeletedcards"] = results[1].data.length;
      }
      
      let message = [];
      if (results[0].error) {
        message = [...message, "Failed to delete deck!"]
      }
      if (results[1].error) {
        message = [...message, "Failed to delete cards!"]
      }

      if (results[0].error || results[1].error) {
        throw new Error(`${[...message]}` );
      }

      res
        .status(200)
        .json(
          success
        );
    } catch(err) {
      console.log(err)
      
      res
        .status(400)
        .json({
          error: err.message
        })
    }
  });

  return router;
};
