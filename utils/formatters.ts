type validDate = Date | number | string;

function wrapper(callback: (date: validDate) => string) {
  return (date?: validDate) => {
    if (!date) {
      return "";
    }
    return callback(date);
  };
}

function getDate(date: validDate) {
  return new Date(date);
}

const date = wrapper((date: validDate) =>
  getDate(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
);

const time = wrapper((date: validDate) =>
  getDate(date).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
  })
);

const dateTime = wrapper((date: validDate) => {
  return getDate(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
});

const formatters = { date, time, dateTime };

export default formatters;
