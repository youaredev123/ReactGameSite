import * as Actions from '../actions';

const initialState = {
  message: '',
  games: []
};

const homeslotes = function (state = initialState, action) {
  switch (action.type) {
    case Actions.GET_INITIAL_GAMES:
      {
        return {
          ...state,
          games: action.payload
        };
      }
    case Actions.GET_MORE_GAMES:
      {
        return {
          ...state,
          games: action.payload
        };
      }
    case Actions.GET_FILTERED_GAMES:
      {
        return {
          ...state,
          games: action.payload
        };
      }
    case Actions.GET_MORE_GAMES_WITH_FILTER:
      {
        return {
          ...state,
          games: action.payload
        };
      }

    default:
      {
        return state;
      }
  }
};

export default homeslotes;

