import * as Actions from '../actions';

const initialState = {
  success: false,
  login_message: '',
  register_message: '',
  name_error: null,
  email_error: null,
  banknumber_error: null,

  error: null,
  imone_already_exist: null
};

const auth = function (state = initialState, action) {
  switch (action.type) {
    case Actions.LOGIN_SUCCESS:
      {
        return {
          ...initialState,
          success: true,
          login_message: 'success'
        };
      }

    case Actions.LOGIN_ERROR:
      {
        return {
          ...initialState,
          success: false,
          error: action.payload
        };
      }

    case Actions.REGISTER_SUCCESS:
      {
        return {
          ...initialState,
          success: true,
          register_message: 'Register Success!',
        };
      }

    case Actions.REGISTER_NAME_ERROR:
      {
        return {
          ...initialState,
          success: false,
          name_error: action.payload,
        };
      }
    case Actions.REGISTER_EMAIL_ERROR:
      {
        return {
          ...initialState,
          success: false,
          email_error: action.payload,
        };
      }
      case Actions.BANK_NUMBER_DUPLICATE:
        {
          return {
            ...initialState,
            success: false,
            banknumber_error: action.payload,
          };
        }
    case Actions.REGISTER_ALREADY_IMONE:
      {
        return {
          ...initialState,
          success: false,
          imone_already_exist: action.payload
        }
      }

    default:
      {
        return state
      }
  }
};

export default auth;