// jshint esversion:9
import ms from 'ms';
import ImageResizer from 'react-image-file-resizer';

// ms converts days to milliseconds
// then i can use it to define the date that the user can book
export const minDays = ms('2d');
export const maxDays = ms('60d');

// app name is also hardcoded in the manifest.json file
export const APP = {
  name: 'a cozinha da sandra',
  ownerName: 'Sandra',
  email: 'cozinhadasandra22@gmail.com',
  navbarHeight: '64px',
  currency: '€',
  categories: {
    doces: 'doces',
    salgados: 'salgados',
  },
  dataInicioActividade: '2 Maio de 2023',
};

export const capitalizeAppName = () => {
  let capitalizedName = APP.name
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
  return capitalizedName;
};

export const getHomePageCategoryItems = (itemsArr, category) => {
  let counter = 0;
  let amountOfItemsToDisplay = 3;

  const filteredArray = itemsArr.filter((item) => {
    if (counter < amountOfItemsToDisplay && item.category === category) {
      counter++;
      return item;
    }
    return null;
  });
  return filteredArray;
};

export const validateDeliveryFee = (value) => {
  //regEx to prevent from typing letters
  const re = /^[0-9.]+$/;
  return re.test(value) || value === '';
};

export const handleCustomDeliveryFee = (value, setValue) => {
  const isValid = validateDeliveryFee(value);
  if (isValid) setValue(value);
};

export const isValidDeliveryDate = (deliveryDate, userType) => {
  //delivery date must be min 2 days from actual date
  const minDate = new Date(+new Date() + minDays).toISOString().slice(0, -8);
  const isUser = userType === 'user';
  return new Date(deliveryDate) > new Date(isUser && minDate);
};
export const validateAddressCode = (value) => {
  // 8800-123
  const re = /^[0-9]{0,4}(?:-[0-9]{0,3})?$/;
  return re.test(value) || value === '';
};

export const isElegibleForGlobalDiscount = (globalDeliveryDiscount, deliveryMethod, haveExtraFee, orderDeliveryMethod, orderDeliveryDiscount) => {
  //CartPage
  if (globalDeliveryDiscount && deliveryMethod === 'delivery' && !haveExtraFee) return true;

  //EditOrderPage
  if (orderDeliveryMethod === 'delivery' && orderDeliveryDiscount && !haveExtraFee) return true;

  return false;
};

export const getMissingAmountForFreeDelivery = (amountForFreeDelivery, cartTotal, orderDeliveryMethod) => {
  if (orderDeliveryMethod === 'takeAway') {
    return ` ${(amountForFreeDelivery - cartTotal).toFixed(2)}`;
  }
  return ` ${(amountForFreeDelivery - cartTotal).toFixed(2)}`;
};

export const handleFileUpload = async (e, setTempImageUrl, setObjImageToUpload) => {
  const resizeFile = (file) =>
    new Promise((resolve) => {
      ImageResizer.imageFileResizer(
        file,
        300, // new maxWidth
        300, // new maxHheight
        'JPEG', // output format
        60, // quality (optional)
        0, // rotation (optional)
        (uri) => {
          resolve(uri);
        },
        'base64' // output type (optional)
      );
    });

  try {
    if (e.target.files.length !== 0) {
      const resizedImg = await resizeFile(e.target.files[0]);
      setTempImageUrl(resizedImg);
      // converts URI image to blob
      const blobImg = await (await fetch(resizedImg)).blob();
      setObjImageToUpload(blobImg);
    }
  } catch (error) {
    console.log('Error while uploading the file: ', error);
  }
};

export const validatePrice = (value) => {
  // prevents from typing letters

  const re = /^[0-9]*\.?[0-9]*$/;
  return value === '' || re.test(value);
};

export const validateContact = (value) => {
  // prevents from typing letters and adding limit of 14 digits
  const re = /^[0-9]{0,14}$/;

  return value === '' || re.test(value);
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
