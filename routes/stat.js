const express = require('express');
const router = express.Router();
const {
  validateAccessToken,
} = require("../middleware/auth0.middleware.js");

module.exports = ({
  getStats,
  addStats
}) => {

  router.get('/', (req, res) => {
    getStats()
      .then((stats) => {
        res
          .status(200)
          .json(stats);
      })
      .catch((err) => res.json({
        error: err.message
      }));
  });

  router.post('/', validateAccessToken, async (req, res) => {
    const { stats } = req.body;
    const userId = req.auth.payload.sub;
    try {
      const numOfItem = await addStats(stats, userId);
      res
        .status(200)
        .json({
          numOfItem
        });
    } catch (err) {
      res
        .status(409)
        .json({
          error: err.message
        })
    }
  });

  return router;
}
