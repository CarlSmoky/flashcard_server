const express = require('express');
const router = express.Router();

module.exports = ({
  getUsers
}) => {

  router.get('/', (req, res) => {
    getUsers()
      .then((users) => {
        res
          .status(200)
          .json(users);
      })
      .catch((err) => res.json({
        error: err.message
      }));
  });

  return router;
};
