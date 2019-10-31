import * as actionTypes from "./types";

export const setUser = user => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user
    }
  };
};

export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER
  };
};

export const openGroup = group => {
  return {
    type: actionTypes.OPEN_GROUP,
    payload: {
      openPanel: "group",
      id: group.id
    }
  };
};

export const openItinerary = itinerary => {
  return {
    type: actionTypes.OPEN_ITINERARY,
    payload: {
      openPanel: "itinerary",
      id: itinerary.id
    }
  };
};
