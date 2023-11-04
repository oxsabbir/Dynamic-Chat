const timeGenarator = function (timeStamp) {
  console.log(timeStamp);
  if (!timeGenarator) return;
  const diff = Date.now() - timeStamp;
  console.log(new Date(timeStamp));

  const second = Math.round(diff / 1000);
  const minute = Math.round(diff / 1000 / 60);
  let thetime;

  if (minute < 60) {
    thetime = `${minute} minutes`;
    console.log(minute);
  } else if (minute > 60 && minute < 1440) {
    const hour = minute / 60;
    thetime = `${hour.toFixed(1)} hours`;
  } else if (minute > 1440) {
    const days = minute / 1440;
    console.log(days);
    thetime = `${days.toFixed(0)} days`;
  }
  return thetime;
};

export default timeGenarator;
