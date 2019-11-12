export const stringToDate = date => {
  const split = date.split("-");
  return new Date(split[0], split[1] - 1, split[2]);
};

export const compareDates = (date1, date2) => {
  const d1 = stringToDate(date1),
    d2 = stringToDate(date2);
  return d1 - d2;
};

export const emptyObject = obj =>
  Object.entries(obj).length === 0 && obj.constructor === Object;
