import * as Actions from '../actions';

const initialState = {
  role: '',
  data: {},
  logout_message: null,
  loading: false
};

const user = function (state = initialState, action) {
  switch (action.type) {
    case Actions.SET_USER_DATA:
      {
        return {
          ...initialState,
          ...action.payload
        };
      }
    case Actions.REMOVE_USER_DATA:
      {
        return {
          ...initialState
        };
      }
    case Actions.USER_LOGGED_OUT:
      {
        return {
          ...initialState,
          logout_message: action.payload
        }
      }
    case Actions.USER_LOGGED_OUT_SESSION_ERROR:
      {
        return {
          ...initialState,
          logout_message: action.payload
        }
      }
    case Actions.USER_LOGGED_START:
      {
        return {
          ...initialState,
          loading: action.payload
        }
      }
      case Actions.USER_LOGGED_END:
        {
          return {
            ...initialState,
            loading: action.payload
          }
        }
    default:
      {
        return state
      }
  }
};

export default user;
