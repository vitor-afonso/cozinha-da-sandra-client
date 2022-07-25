// jshint esversion:9

const parseDate = (dateToParse) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  let dateMinutes;

  // to prevent other than date type arguments
  if (typeof dateToParse.getMonth === 'function') {
    return;
  }

  let date = new Date(dateToParse);
  let dateYear = date.getFullYear();
  let dateMonth = months[date.getMonth()];
  let dateDay = date.getDate();
  let dateHour = date.getHours() - 1;
  //to add a 0 when the MINUTES is only one digit
  if (date.getMinutes() <= 9) {
    dateMinutes = `${0}${date.getMinutes()}`;
  } else {
    dateMinutes = date.getMinutes();
  }
  let parsedDate = `${dateDay}-${dateMonth}-${dateYear}  ${dateHour}:${dateMinutes}H`;

  return parsedDate;
};

const formatDate = (date) => {
  // to prevent other than date type arguments
  if (typeof date.getMonth === 'function') {
    return;
  }

  let dateYear = date.getFullYear();
  let dateMonth;
  //to add a 0 when the MONTH is only one digit
  if (date.getMonth() <= 9) {
    dateMonth = `${0}${date.getMonth() + 1}`;
  } else {
    dateMonth = date.getMonth() + 1;
  }
  let dateDay = date.getDate() + 1;
  let dateHour = date.getHours();
  let dateMinutes;
  //to add a 0 when the MINUTES is only one digit
  if (date.getMinutes() <= 9) {
    dateMinutes = `${0}${date.getMinutes()}`;
  } else {
    dateMinutes = date.getMinutes();
  }
  let formatedDate = `${dateYear}-${dateMonth}-${dateDay}T${dateHour}:${dateMinutes}`;

  return formatedDate;
};

const getItemsQuantity = (order) => {
  const items = {};
  const itemsArray = [];

  // creates the item(key) and updates the quantity(value) for each item
  order.items.forEach((item) => {
    items[item.name] = (items[item.name] || 0) + 1;
  });

  // creates a string from each property in the object to be added to the array
  for (let i in items) {
    itemsArray.push(`${i}: ${items[i]}`);
  }
  return itemsArray;
};

exports.parseDate = parseDate;
exports.formatDate = formatDate;
exports.getItemsQuantity = getItemsQuantity;
