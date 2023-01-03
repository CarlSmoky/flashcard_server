const express = require('express');
const router = express.Router();

module.exports = ({
  getLearnings
}) => {

  router.get('/', (req, res) => {
    getLearnings()
      .then((learnings) => {
        res
          .status(200)
          .json(learnings);
      })
      .catch((err) => res.json({
        error: err.message
      }));
  });

  return router;
};
