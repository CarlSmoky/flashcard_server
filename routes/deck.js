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
        throw new Error(`Failed to get deck list.`);
      }

      res
        .status(200)
        .json(data);
    } catch (err) {
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

        if (error) {
          throw new Error("Failed to add cards!");
        }
      }

      res
        .status(200)
        .json({
          results
        });
    } catch (err) {
      const statusCode = err.message.search("duplicate key value") === -1 ? 400 : 409;
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

    const results = {}
    let errorMessage = "";

    try {
      const { data, error } = await getOwerOfDeckId(deckId);

      if (auth0UserId !== data.user_id || error) {
        errorMessage = "User doesn't match. Only deck owner can change their decks and cards.";
        throw new Error(errorMessage);
      }

      if (updateDeckData !== null) {
        const { data, error } = await updateDeck(updateDeckData.id, updateDeckData.deckName, updateDeckData.description);

        if (error) {
          errorMessage = `Failed to update deck! error: ${error}`;
          throw new Error(errorMessage);
        }

        if (data) {
          results["updateDeckData"] = data;
        }
      }

      if (updateCardsData.length !== 0) {
        const { data, error } = await updateCards(updateCardsData);

        if (error) {
          errorMessage = `Failed to update cards! error: ${error}`
          throw new Error(errorMessage);
        }

        if (data) {
          results["updateCardsData"] = data;
        }
      }

      if (createdCardsData.length !== 0) {
        const { data, error } = await addCards(createdCardsData, deckId);

        if (error) {
          errorMessage = `Failed to careate cards! error: ${error}`
          throw new Error(errorMessage);
        }

        if (data) {
          results["createdCardsData"] = data;
        }
      }

      if (deleteCardsData.length !== 0) {
        const { data, error } = await deleteCards(deleteCardsData);
        if (error) {
          errorMessage = `Failed to delete cards! error: ${error}`
          throw new Error(errorMessage);
        }

        if (data) {
          results["deleteCardsData"] = data;
        }
      }

      res
        .status(200)
        .json(
          results
        );
    } catch (err) {
      if (err.message.search("duplicate key value") >= 0) {
        statusCode = 409
      } else if (err.message.search("User doesn't match.") >= 0) {
        statusCode = 403
      } else {
        statusCode = 400
      }
      err.message = err.message.search("duplicate key value") === -1 ? err.message : "The title has been used. Try other title";

      res
        .status(statusCode)
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
      const promiseResult = await Promise.all([deleteDeck(deckId), deleteCardsByDeckId(deckId)]);

      let results = {};
      if (promiseResult[0].data && promiseResult[1].data) {
        results["deletedDeckName"] = promiseResult[0].data.deck_name;
        results["numOfDeletedcards"] = promiseResult[1].data.length;
      }

      let message = [];
      if (promiseResult[0].error) {
        message = [...message, "Failed to delete deck!"]
      }
      if (promiseResult[1].error) {
        message = [...message, "Failed to delete cards!"]
      }

      if (promiseResult[0].error || promiseResult[1].error) {
        throw new Error(`${[...message]}`);
      }

      res
        .status(200)
        .json(
          results
        );
    } catch (err) {
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
