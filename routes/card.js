const express = require('express');
const router = express.Router();
const {
  validateAccessToken,
} = require("../middleware/auth0.middleware.js");

module.exports = ({
  getDeckById,
  getCardsByDeckID,
  getOrderedCardsByDeckID
}) => {

  router.get('/deck/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const results = await Promise.all([getDeckById(id), getCardsByDeckID(id)]);

      const deck = results[0].data;
      const cards = results[1].data;

      let message = [];
      if (results[0].error) {
        message = [...message, "Failed to get deck!"]
      }
      if (results[1].error) {
        message = [...message, "Failed to get cards!"]
      }

      if (results[0].error || results[1].error) {
        throw new Error(`${[...message]}` );
      }

      res
        .status(200)
        .json({
          deck,
          cards
        });
    } catch (err) {
      res
        .status(400)
        .json({
          error: err.message
        })
    }
  });

  router.post('/deck/:id', validateAccessToken, async (req, res) => {
    const id = req.params.id;
    const userId = req.auth.payload.sub;
  
    if (!id) {
      throw new Error("deck id is missing!");
    }
    if (!userId) {
      throw new Error("user id is missing!");
    }

    try {
      const results = await Promise.all([getDeckById(id), getOrderedCardsByDeckID(id, userId)]);

      const deck = results[0].data;
      const cards = results[1].data;

      let message = [];
      if (results[0].error) {
        message = [...message, "Failed to get deck!"]
      }
      if (results[1].error) {
        message = [...message, "Failed to get cards!"]
      }

      if (results[0].error || results[1].error) {
        throw new Error(`${[...message]}` );
      }

      res
        .status(200)
        .json({
          deck,
          cards
        });
    } catch (err) {
      res
        .status(400)
        .json({
          error: err.message
        })
    }
  });

  return router;
};
