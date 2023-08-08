const getCreateCardParams = (newCardContents, columns) => {
  let result = '';
  let i = 0;
    while (i < newCardContents.length * columns.length) {
      i++;
      let el = '$' + i;

      if (i % columns.length === 1) {
        result += `(${el}, `;
      } else if (i % columns.length === 0 && i === newCardContents.length * columns.length) {
        result += `${el}) `;
      } else if (i % columns.length === 0) {
        result += `${el}), `;
      } else {
        result += `${el}, `;
      }      
    }
  return result;
}

const getCreateCardValues = (newCardContents, deckId) => {
  let result = [];
  newCardContents.forEach((element, index) => {
    result = [...result, deckId];
    Object.keys(element).forEach(key => {
      const string = newCardContents[index][key];
      result = [...result, string];
    })
  });
  return result;
}

//Helpers
const getUpdateCardsValues = (updateCardsData) => {
  let values = [];
  updateCardsData.forEach(card => {
    values = [...values, card.id, card.term, card.definition];
  })
  return values;
}

const getIds =  (updateCardsData) => { 
  return updateCardsData.map ((_, index) => {
    return `$${(index * 3) + 1}` 
  })
}

const formatQueryParams = (index, columnName) => {
  const newIndex = (index * 3) + 1
  let columnIndex;

  if (columnName === 'term') {
    columnIndex = newIndex + 1
  }
  if (columnName === 'definition') {
    columnIndex = newIndex + 2
  }
  return `WHEN id = $${newIndex} THEN $${columnIndex} `
}

const generateUpdateCardsQuery = (updateCardsData) => {
  const ids = getIds(updateCardsData);

  let query = 'UPDATE cards SET term = CASE ';
  updateCardsData.forEach((_, index) => {
    const queryString = formatQueryParams(index, 'term');
    query += queryString;
  })

  query += `ELSE term END, definition = CASE `;

  updateCardsData.forEach((_, index) => {
    const queryString = formatQueryParams(index,'definition');
    query += queryString;
  })
  query += `ELSE definition END `;
  query += `WHERE id IN (${ids}) returning *;`;
  
  return query;
}

module.exports = {
  getCreateCardParams,
  getCreateCardValues,
  generateUpdateCardsQuery,
  getUpdateCardsValues
};