const express = require('express');
const router = express.Router();

module.exports = ({
  getDeckById,
  getCardsByDeckID
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

  return router;
};
