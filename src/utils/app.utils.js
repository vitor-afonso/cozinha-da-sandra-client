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

exports.parseDate = parseDate;
