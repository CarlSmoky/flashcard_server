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

module.exports = {
  getCreateCardParams,
  getCreateCardValues
};