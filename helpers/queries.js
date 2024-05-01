const {
  generateParams,
  generateValues,
  generateUpdateCardsQuery,
  getUpdateCardsValues
} = require('./dataHelpers');

queryStrings = {
  "GET_CARDS_BY_DECKID" : (id) => {
    return  {
      text: `SELECT * FROM cards WHERE deck_id = $1`,
      values: [id]
    }
  },
  "ADD_CARDS" : (columns, data, deckId) => {
    return {
      text: `INSERT INTO cards (${[...columns]}) VALUES${generateParams(data, columns)} returning *`,
      values: generateValues(data, deckId)
    }
  },
  "UPDATE_CARDS" : (data) => {
    return {
      text: generateUpdateCardsQuery(data),
      values: getUpdateCardsValues(data)
    }
  },
  "DELETE_CARDS" : (ids) => {
    return {text:  `DELETE FROM cards WHERE id IN (${[...ids]}) returning *`}
  },
  "DELETE_CARDS_BY_DECK_ID" : (id) => {
    return {
      text: `DELETE FROM cards WHERE deck_id = $1 returning *`,
      values: [id]
    }
  },
  "GET_DECKS" : {
    text: `SELECT * FROM decks`
  },
  "GET_DECK_BY_ID": (id) => {
    return {
      text: `SELECT * FROM decks WHERE id = $1`,
      values: [id]
    }
  },
  "ADD_DECK": (deckName, description, userId) => {
    return {
      text: `INSERT INTO decks (deck_name, description, user_id) VALUES($1, $2, $3) returning *`,
      values: [deckName, description, userId]
    }
  },
  "UPDATE_DECK" : (id, deckName, description) => {
   return {
    text: `UPDATE decks SET deck_name = $2, description = $3 WHERE id = $1 returning *`,
    values: [id, deckName, description]
    }
  },
  "DELETE_DECK" : (id) => {
    return {
      text: `DELETE FROM decks WHERE id = $1 returning *`,
      values: [id]
    }
  },
  "GET_OWNER_BY_DECK_ID" : (id) => {
    return {
      text: `SELECT user_id FROM decks WHERE id = $1`,
      values: [id]
    }
  },
  "GET_STATS": {
    text: `SELECT * FROM stats`
  },
  "ADD_STATS": (columns, stats, userId) => {
    return {
      text: `INSERT INTO stats (${[...columns]}) VALUES${generateParams(stats, columns)} returning *`,
      values: generateValues(stats, userId)
    }
  }
}
module.exports = {
  queryStrings
}