const {
  generateParams,
  generateValues,
  generateUpdateCardsQuery,
  getUpdateCardsValues
} = require('./dataHelpers');

query_strings = {
  "GET_CARDS": {
    text: `SELECT * FROM cards`
  },
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
  "UPDATE_CARDS" : {
    text: (data) => generateUpdateCardsQuery(data),
    values: (data) => getUpdateCardsValues(data)
  },
  "DELETE_CARDS" : {
    text: (ids) => `DELETE FROM cards WHERE id IN (${[...ids]}) returning *`
  },
  "DELETE_ALL_CARDS_BY_DECK_ID" : {
    text: `DELETE FROM cards WHERE deck_id = $1 returning *`,
    values: (id) => [id]
  },
  "GET_DECKS" : {
    text: `SELECT * FROM decks`
  },
  "GET_DECK_BY_ID": {
    text: `SELECT * FROM decks WHERE id = $1`,
      values: (id) => [id]
  },
  "ADD_DECK": {
    text: `INSERT INTO decks (deck_name, description, user_id) VALUES($1, $2, $3) returning *`,
    values: (deckName, description, userId) => [deckName, description, userId]
  },
  "UPDATE_DECK" : {
    text: `UPDATE decks SET deck_name = $2, description = $3 WHERE id = $1 returning *`,
    values: (id, deckName, description) => [id, deckName, description]
  },
  "DELETE_DECK" : {
    text: `DELETE FROM decks WHERE id = $1 returning *`,
    values: (id) => [id]
  },
  "GET_OWNER_BY_DECK" : {
    text: `SELECT user_id FROM decks WHERE id = $1`,
    values: (id) => [id]
  },
  "GET_STATS": {
    text: `SELECT * FROM stats`
  },
  "ADD_STATS": {
    text: (columns, stats) => `INSERT INTO stats (${[...columns]}) VALUES${generateParams(stats, columns)} returning *`,
    values: (stats, userId) => generateValues(stats, userId)
  }
}
module.exports = {
  query_strings
}