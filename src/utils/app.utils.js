// jshint esversion:9

const parseDateToShow = (dateToParse) => {
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
  let dateHour = date.getHours();
  //to add a 0 when the MINUTES is only one digit
  if (date.getMinutes() <= 9) {
    dateMinutes = `${0}${date.getMinutes()}`;
  } else {
    dateMinutes = date.getMinutes();
  }
  let parsedDate = `${dateDay}-${dateMonth}-${dateYear}  ${dateHour}:${dateMinutes}H`;

  return parsedDate;
};

const parseDateToEdit = (dateToFormat) => {
  // to prevent other than date type arguments
  if (typeof dateToFormat.getMonth === 'function') {
    return;
  }
  let date = new Date(dateToFormat);
  let dateYear = date.getFullYear();
  let dateMonth;
  //to add a 0 when the MONTH is only one digit
  if (date.getUTCMonth() <= 9) {
    dateMonth = `${0}${date.getUTCMonth() + 1}`;
  } else {
    dateMonth = date.getUTCMonth() + 1;
  }
  let dateDay;
  //to add a 0 when the DAY is only one digit
  if (date.getDate() <= 9) {
    dateDay = `${0}${date.getDate()}`;
  } else {
    dateDay = date.getDate();
  }
  let dateHour;
  //to add a 0 when the HOUR is only one digit
  if (date.getUTCHours() <= 9) {
    dateHour = `${0}${date.getUTCHours() + 1}`;
  } else {
    dateHour = date.getUTCHours() + 1;
  }
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

const parseClientMinDate = () => {
  let date = new Date();
  let dateYear = date.getFullYear();
  let dateMonth;
  //to add a 0 when the MONTH is only one digit
  if (date.getUTCMonth() <= 9) {
    dateMonth = `${0}${date.getUTCMonth() + 1}`;
  } else {
    dateMonth = date.getUTCMonth() + 1;
  }
  let dateDay;
  //to add a 0 when the DAY is only one digit
  if (date.getDate() <= 9) {
    dateDay = `${0}${date.getDate() + 5}`;
  } else {
    dateDay = date.getDate() + 5;
  }
  let minDate = `${dateYear}-${dateMonth}-${dateDay}`;

  return minDate;
};

const parseAdminMinDate = () => {
  let date = new Date();
  let dateYear = date.getFullYear();
  let dateMonth;
  //to add a 0 when the MONTH is only one digit
  if (date.getUTCMonth() <= 9) {
    dateMonth = `${0}${date.getUTCMonth() + 1}`;
  } else {
    dateMonth = date.getUTCMonth() + 1;
  }
  let dateDay;
  //to add a 0 when the DAY is only one digit
  if (date.getDate() <= 9) {
    dateDay = `${0}${date.getDate() + 1}`;
  } else {
    dateDay = date.getDate() + 1;
  }
  let minDate = `${dateYear}-${dateMonth}-${dateDay}T00:00`;

  return minDate;
};

exports.parseDateToShow = parseDateToShow;
exports.parseDateToEdit = parseDateToEdit;
exports.getItemsQuantity = getItemsQuantity;
exports.parseClientMinDate = parseClientMinDate;
exports.parseAdminMinDate = parseAdminMinDate;
