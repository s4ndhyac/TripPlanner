import Pusher from 'pusher-js';

const TOKEN_KEY = "tripplanner-user-token";
const authBaseUrl = process.env.REACT_APP_ENVIRONMENT && process.env.REACT_APP_ENVIRONMENT === "prod" ? "https://backend.trippplanner.com" : "http://localhost:8000";
const apiAuthToken = "Token " + localStorage.getItem(TOKEN_KEY);

var pusher = new Pusher('984d71bda00ac34d7d56', {
  cluster: 'us3',
  forceTLS: true,
  authEndpoint: authBaseUrl + '/members/pusher_auth/',
  auth: {
    headers: {
      'Authorization': apiAuthToken
    }
  }
});

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


export const pusherSubscribe = (channelId, eventId, callback) => {
  var channel = pusher.subscribe(channelId);
  channel.bind(eventId, callback);
  return channel;
}

export const pusherPublish = (channelId, eventId, data) => {
  var channel = pusher.channel(channelId);
  channel.trigger(eventId, data);
}

export const pusherUnsubscribe = (channelId) => {
  pusher.unsubscribe(channelId);
}

export const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let colour = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  if (parseInt(colour, 16) > 15658734) return '#eeeeee';
  return colour;
}