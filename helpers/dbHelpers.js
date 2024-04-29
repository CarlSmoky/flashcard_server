const { query_strings } = require('./queries');

module.exports = (db) => {
  //Cards

  const getCardsByDeckID = async (id) => {
    try {
      const query = query_strings.GET_CARDS_BY_DECKID(id);
      const result = await db.query(query);
      return result.rows;
    } catch(error) {
      console.error("Failed to get cards by deck_id!", error);
    }
  };

  const addCards = async (newCardContents, deckId) => {
    const columns = ["deck_id", "term", "definition"];
    try {
      const query = query_strings.ADD_CARDS(columns, newCardContents, deckId);
      const result = await db.query(query);
      
      return {
        data : result.rows,
        error: null
      }
    } catch (error) {
      console.error("Failed to add cards!", error);

      return {
        data: null,
        error, 
      };
    }
  }

  const updateCards = async (updateCardContents) => {

    try {
      const query = query_strings.UPDATE_CARDS(updateCardContents);
      const result = await db.query(query);
      
      return {
        data : result.rows,
        error: null
      }
    } catch (error) {
      console.log("Failed to update cards!", error);
      
      return {
        data: null,
        error, 
      };
    }
  }

  const deleteCards = async (deleteCardsData) => {
    const ids = deleteCardsData.map(card => card.id)
    try {
      const query = query_strings.DELETE_CARDS(ids);
      const result = await db.query(query);
      return {
        data : result.rows,
        error: null
      }
    } catch (error) {
      console.error("Failed to delete cards!", error);

      return {
        data: null,
        error, 
      };
    }
  }

  const deleteAllCardsByDeckId= async (id) => {
    if (!id) {
      throw new Error(`deck_id is missing.`);
    }
    try {
      const query = query_strings.DELETE_ALL_CARDS_BY_DECK_ID(id);
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error("Failed to delete all cards by deck_id!", error);
    }
  }

  // Decks
  const getDecks = async () => {
    
    try {
      const query = query_strings.GET_DECKS;
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error("Failed to get decks!", error);
    }
  };

  const getDeckById = async (id) => {

    try {
      const query = query_strings.GET_DECK_BY_ID(id);
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Failed to get deck_id!", error);
    }
  };

  const addDeck = async (deckName, description, userId) => {

    try {
      const query = query_strings.ADD_DECK(deckName, description, userId) ;
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Failed to add deck!", error);
    }
  }


  const updateDeck = async (id, deckName, description) => {
  
    try {
      const query = query_strings.UPDATE_DECK(id, deckName, description) ;
      const result = await db.query(query);

      return {
        data : result.rows[0],
        error: null
      }
    } catch (error) {
      console.error("Failed to update deck!", error);

      return {
        data: null,
        error, 
      };
    }
  }

  const deleteDeck= async (id) => {
    if (!id) {
      throw new Error(`deck_id is missing.`);
    }

    try {
      const query = query_strings.DELETE_DECK(id) ;
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Failed to delete deck!", error);
    }
  }

  // Auth0
  const getOwerOfDeckId = async (id) => {

      try {
        const query = query_strings.GET_OWNER_BY_DECK_ID(id);
        const result = await db.query(query);
        return result.rows[0];
      } catch (error) {
        console.error("Failed to get owner!", error);
        return error;
      }
  };

  // Learnings
  const getStats = async () => {

      try {
        const query = query_strings.GET_STATS;
        const result = await db.query(query);
        return result.rows;
      } catch (error) {
        console.error("Failed to get stats!", error);
        return error;
      }
  };

  const addStats = async (stats, userId) => {
    
    try {
      const columns = ["user_id", "card_id", "learning", "star"];
      const query = query_strings.ADD_STATS(columns, stats, userId);
      const result = await db.query(query);
      return result.rows.length;
    } catch (error) {
      console.error("Failed to add to stats!", error);
    }
  };

  return {
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
    getOwerOfDeckId
  };
};
