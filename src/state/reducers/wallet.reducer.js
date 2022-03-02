import * as Actions from '../actions';

const initialState = {
  imoneBalance: {},
  transfer_result_message: '',
  transHistory: null,
  error: null,
  minAmount: [],
  wd_pending: false,
  transferAmount: ''
};

const wallet = function (state = initialState, action) {
  switch (action.type) {
    case Actions.GET_BALANCE:
      {
        return {
          ...state,
          imoneBalance: action.payload
        };
      }
    case Actions.TRANSFER_SUCCESS:
      {
        return {
          ...state,
          transHistory: action.payload,
          transfer_result_message: 'success',
          transferAmount: action.amount
        };
      }

    case Actions.GET_TRANSACTION_HISTORY_SUCCESS:
      {
        return {
          ...state,
          transHistory: action.payload
        };
      }
    case Actions.GET_TRANSACTION_HISTORY_ERROR:
      {
        return {
          ...state,
          error: action.payload
        };
      }

    case Actions.GET_MINAMOUNT_SUCCESS:
      {
        return {
          ...state,
          minAmount: action.payload
        };
      }

    case Actions.TRANSFER_INIT:
      {
        return {
          ...state,
          transferAmount: '',
          transfer_result_message: '',
        };
      }


    default:
      {
        return state;
      }
  }
};

export default wallet;
