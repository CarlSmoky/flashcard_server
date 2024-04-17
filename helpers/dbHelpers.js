const {
  generateParams,
  generateValues,
  generateUpdateCardsQuery,
  getUpdateCardsValues
} = require('./dataHelpers');

const { query_strings } = require('./queries');

module.exports = (db) => {
  //Cards
  const getCards = async () => {
    try {
      const query = query_strings.GET_CARDS;
      const result = await db.query(query);
      return result.rows;
    } catch(error) {
      console.log(error)
    }
  };

  const getCardsByDeckID = async (id) => {
    try {
      const query = query_strings.GET_CARDS_BY_DECKID(id);
      const result = await db.query(query);
      return result.rows;
    } catch(error) {
      console.log(error)
    }
  };

  const addCards = async (newCardContents, deckId) => {
    const columns = ["deck_id", "term", "definition"];
    try {
      const query = query_strings.ADD_CARDS(columns, newCardContents, deckId);
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.log(error);
    }
  }

  const updateCards = async (updateCardContents) => {
    const text = generateUpdateCardsQuery(updateCardContents);
    const values = getUpdateCardsValues(updateCardContents);

    const query = {
      text: text,
      values: values
    };

    const dbResult = await db.query(query);
    return dbResult.rows;
  }

  const deleteCards = async (deleteCardsData) => {
    const ids = deleteCardsData.map(card => {
      return card.id
    })
    const query = `DELETE FROM cards WHERE id IN (${[...ids]}) returning *`

    const dbResult = await db.query(query);
    return dbResult.rows;
  }

  const deleteAllCardsByDeckId= async (id) => {
    if (!id) {
      throw new Error(`deck_id is missing.`);
    }
    const query = {
      text: `DELETE FROM cards WHERE deck_id = $1 returning *`,
      values: [id]
    };

    return db
      .query(query)
      .then(result => result.rows)
      .catch((err) => err);
  }

  // Decks
  const getDecks = () => {
    const query = {
      text: `SELECT * FROM decks`
    };

    return db
      .query(query)
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
    const query = {
      text: `INSERT INTO decks (deck_name, description, user_id) VALUES($1, $2, $3) returning *`,
      values: [deckName, description, userId]
    };

    try {
      const dbResult = await db.query(query);
      const deck = dbResult.rows[0];
      return deck;
    } catch (error) {
      console.error("Failed to add deck!", error);
    }
  }


  const updateDeck = async (id, deckName, description) => {
    const query = {
      text: `UPDATE decks SET deck_name = $2, description = $3 WHERE id = $1 returning *`,
      values: [id, deckName, description]
    };

    const dbResult = await db.query(query);
    const deck = dbResult.rows[0];
    return deck;
  }

  const deleteDeck= async (id) => {
    if (!id) {
      throw new Error(`deck_id is missing.`);
    }
    const query = {
      text: `DELETE FROM decks WHERE id = $1 returning *`,
      values: [id]
    };

    return db
      .query(query)
      .then(result => result.rows[0])
      .catch((err) => err);
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

  // Learnings
  const getStats = () => {
    const query = {
      text: `SELECT * FROM stats`
    };

    return db
      .query(query)
      .then(result => result.rows)
      .catch((err) => err);
  };

  const addStats = async (stats, userId) => {
    const columns = ["user_id", "card_id", "learning", "star"];
    const params = generateParams(stats, columns);
    const values = generateValues(stats, userId);
    
    const query = {
      text: `INSERT INTO stats (${[...columns]}) VALUES${params} returning *`,
      values: values
    };

    try {
      const dbResult = await db.query(query);
      const numOfUpdatedItem = dbResult.rows.length;
      return numOfUpdatedItem;
    } catch (error) {
      console.error("Failed to add to stats!", error);
    }
  };

  return {
    getCards,
    getCardsByDeckID,
    addCards,
    updateCards,
    deleteCards,
    deleteAllCardsByDeckId,
    getDecks,
    getDeckById,
    deleteDeck,
    getStats,
    addStats,
    addDeck,
    updateDeck,
    getOwerOfDeck
  };
};
