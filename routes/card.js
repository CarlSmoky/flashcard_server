const express = require('express');
const router = express.Router();

module.exports = ({
  getCards
}) => {

  router.get('/', (req, res) => {
    getCards()
      .then((library) => {
        res
          .status(200)
          .json(library);
      })
      .catch((err) => res.json({
        error: err.message
      }));
  });

  return router;
};
