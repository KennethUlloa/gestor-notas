export type ValidDate = Date | number | string;

function wrapper(callback: (date: ValidDate) => string) {
  return (date?: ValidDate) => {
    if (!date) {
      return "";
    }
    return callback(date);
  };
}

export function getDate(date: ValidDate) {
  return new Date(date);
}

const date = wrapper((date: ValidDate) =>
  getDate(date).toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })
);

const time = wrapper((date: ValidDate) =>
  getDate(date).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
  })
);

const dateTime = wrapper((date: ValidDate) => {
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
