module.exports = (db) => {

  const getCards = () => {
    const query = {
      text: `SELECT * FROM cards`
    };

    return db
      .query(query.text)
      .then(result => result.rows)
      .catch((err) => err);
  };

  return {
    getCards,
  };
};
