import { combineReducers } from "redux";
import * as actionTypes from "../actions/types";

const initialUserState = {
  currentUser: null,
  isLoading: true
};

const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      };
    case actionTypes.CLEAR_USER:
      return {
        ...initialUserState,
        isLoading: false
      };
    default:
      return state;
  }
};

const initialPanelState = {
  openPanel: null,
  id: null
};

const panelReducer = (state = initialPanelState, action) => {
  switch (action.type) {
    case actionTypes.OPEN_GROUP:
      return action.payload;
    case actionTypes.OPEN_ITINERARY:
      return action.payload;
    default:
      return state;
  }
};

const initialSidebarState = {
  isCollapsed: false
};

const sidebarReducer = (state = initialSidebarState, action) => {
  switch (action.type) {
    case actionTypes.COLLAPSE_SIDEBAR:
      return action.payload;
    case actionTypes.EXPAND_SIDEBAR:
      return action.payload;
    default:
      return state;
  }
};

const intialGroups = {
  groups: []
};

const groupReducer = (state = intialGroups, action) => {
  switch (action.type) {
    case actionTypes.ADD_GROUP:
      {
        const newGroup = action.payload.groups;
        return [
          ...state.groups,
          newGroup
        ];
      }
    default:
      return state;
  }
}

const initialItineraries = {
  itineraries: {}
};

const itineraryReducer = (state = initialItineraries, action) => {
  switch (action.type) {
    case actionTypes.ADD_ITINERARY:
      return action.payload;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  panel: panelReducer,
  sidebar: sidebarReducer,
  groups: groupReducer,
  itineraries: itineraryReducer
});

export default rootReducer;
