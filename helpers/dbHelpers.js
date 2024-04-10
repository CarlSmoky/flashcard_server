const {
  getCreateCardParams,
  getCreateCardValues,
  generateUpdateCardsQuery,
  getUpdateCardsValues
} = require('./dataHelpers');

module.exports = (db) => {
  //Cards
  const getCards = () => {
    const query = {
      text: `SELECT * FROM cards`
    };

    return db
      .query(query.text)
      .then(result => result.rows)
      .catch((err) => err);
  };

  const getCardsByDeckID = id => {
    const query = {
      text: `SELECT * FROM cards WHERE deck_id = $1`,
      values: [id]
    };

    return db
      .query(query)
      .then((result) => result.rows)
      .catch((err) => err);
  };

  const addCards = async (newCardContents, deckId) => {
    const columns = ["deck_id", "term", "definition"];
    const params = getCreateCardParams(newCardContents, columns);
    const values = getCreateCardValues(newCardContents, deckId);

    const createCardsQuery = {
      text: `INSERT INTO cards (${[...columns]}) VALUES${params} returning *`,
      values: values
    };

    const dbResult = await db.query(createCardsQuery);
    return dbResult.rows;
  }

  const updateCards = async (updateCardContents) => {
    const query = generateUpdateCardsQuery(updateCardContents);

    const values = getUpdateCardsValues(updateCardContents);

    const updateCardsQuery = {
      text: query,
      values: values
    };

    const dbResult = await db.query(updateCardsQuery);
    return dbResult.rows;
  }

  const deleteCards = async (deleteCardsData) => {
    const ids = deleteCardsData.map(card => {
      return card.id
    })
    const deleteCardsQuery = `DELETE FROM cards WHERE id IN (${[...ids]}) returning *`

    const dbResult = await db.query(deleteCardsQuery);
    return dbResult.rows;
  }

  // Decks
  const getDecks = () => {
    const query = {
      text: `SELECT * FROM decks`
    };

    return db
      .query(query.text)
      .then(result => result.rows)
      .catch((err) => err);
  };

  const getDeckById = id => {

    const query = {
      text: `SELECT * FROM decks WHERE id = $1`,
      values: [id]
    };

    return db
      .query(query)
      .then(result => result.rows[0])
      .catch((err) => err);
  };

  const addDeck = async (deckName, description, userId) => {
    const deckQuery = {
      text: `INSERT INTO decks (deck_name, description, user_id) VALUES($1, $2, $3) returning *`,
      values: [deckName, description, userId]
    };

    try {
      const dbResult = await db.query(deckQuery);
      const deck = dbResult.rows[0];
      return deck;
    } catch (error) {
      console.error("Failed to add deck!", error);
    }
  }


  const updateDeck = async (id, deckName, description) => {
    const updateDeckQuery = {
      text: `UPDATE decks SET deck_name = $2, description = $3 WHERE id = $1 returning *`,
      values: [id, deckName, description]
    };

    const dbResult = await db.query(updateDeckQuery);
    const deck = dbResult.rows[0];
    return deck;
  }

  // Auth0
  const getOwerOfDeck = (id) => {
    const query = {
      text: `SELECT user_id FROM decks WHERE id = $1`,
      values: [id]
    };

    return db
      .query(query)
      .then(result => result.rows[0])
      .catch((err) => err);
  };

  // Users
  const getUsers = () => {
    const query = {
      text: `SELECT * FROM users`
    };

    return db
      .query(query.text)
      .then(result => result.rows)
      .catch((err) => err);
  };

  const getUserByEmail = email => {

    const query = {
      text: `SELECT * FROM users WHERE email = $1`,
      values: [email]
    };

    return db
      .query(query)
      .then(result => result.rows[0])
      .catch((err) => err);
  };

  const addUser = (firstName, lastName, email, hashedPassword) => {

    const query = {
      text: `INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4) returning id, first_name, last_name, email`,
      values: [firstName, lastName, email, hashedPassword]
    };
    return db.query(query)
      .then(result => {
        return result.rows[0];
      })
      .catch(err => {
        console.log(err);
        // return err;
      });
  };

  // Learnings
  const getStats = () => {
    const query = {
      text: `SELECT * FROM stats`
    };

    return db
      .query(query.text)
      .then(result => result.rows)
      .catch((err) => err);
  };

  return {
    getCards,
    getCardsByDeckID,
    addCards,
    updateCards,
    deleteCards,
    getDecks,
    getDeckById,
    getUsers,
    getUserByEmail,
    addUser,
    getStats,
    addDeck,
    updateDeck,
    getOwerOfDeck
  };
};
