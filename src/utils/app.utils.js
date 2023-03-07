// jshint esversion:9
// app name is also hardcoded in the manifest.json file
export const appName = 'a cozinha da sandra';
export const ownerName = 'Sandra';
export const appEmail = 'cozinhadasandra22@gmail.com';
export const NAVBAR_HEIGHT = '64px';

export const capitalizeAppName = () => {
  let capitalizedName = appName
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
  return capitalizedName;
};

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
  if (date.getUTCMonth() + 1 <= 9) {
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
  if (date.getUTCHours() + 1 <= 9) {
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

const getItemsPrice = (order) => {
  const items = {};
  const itemsArray = [];

  // creates the item(key) and updates the quantity(value) for each item
  order.items.forEach((item) => {
    items[item.name] = (items[item.name] || 0) + item.price;
  });

  // creates a string from each property in the object to be added to the array
  for (let i in items) {
    itemsArray.push(`${i}: ${items[i].toFixed(2)}`);
  }
  return itemsArray;
};

const getItemsAmount = (orderItems) => {
  const items = {};

  orderItems.forEach((item) => {
    items[item.name] = (items[item.name] || 0) + 1;
  });

  return items;
};

export { parseDateToShow, parseDateToEdit, getItemsQuantity, getItemsPrice, getItemsAmount };
