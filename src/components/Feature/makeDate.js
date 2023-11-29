const makeDate = function (time) {
  const date = new Date(time);

  return date.toDateString().substring(4);
};

export default makeDate;
