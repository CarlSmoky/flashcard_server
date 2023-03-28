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
    const deckId = dbResult.rows[0].id;
    return deckId;
  
    } catch(error) {
      console.error("The Promise is rejected!", error);
    } finally {
    console.log(
    "The Promise is settled, meaning it has been resolved or rejected."
    );
    }
  }

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
    getDecks,
    getDeckById,
    getUsers,
    getUserByEmail,
    addUser,
    getStats,
    addDeck
  };
};
