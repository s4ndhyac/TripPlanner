import ls from 'local-storage';

const USER_KEY = 'tripplanner_user';
const LOGGED_IN = 'tripplanned_logged_in?';

export default class StateStorage {
  static loginUser(user) {
    ls.set(USER_KEY, JSON.stringify(user));
    ls.set(LOGGED_IN, true);
  }

  static getUser() {
    return JSON.parse(ls.get(USER_KEY));
  }

  static logoutUser() {
    ls.remove(USER_KEY);
    ls.set(LOGGED_IN, false);
  }

  static loggedIn() {
    return ls.get(LOGGED_IN);
  }
}