
import api from '../../ApiConfig';

export const GET_BALANCE = 'GET_BALANCE';
export const TRANSFER_SUCCESS = 'TRANSFER_SUCCESS';
export const GET_TRANSACTION_HISTORY_ERROR = 'GET_TRANSACTION_HISTORY_ERROR';
export const GET_TRANSACTION_HISTORY_SUCCESS = 'GET_TRANSACTION_HISTORY_SUCCESS';
export const GET_MINAMOUNT_SUCCESS = 'GET_MINAMOUNT_SUCCESS';
export const TRANSFER_INIT = 'TRANSFER_INIT';

export function getCurrentGameBalance(balancePlayer) {
  const request = api.post('/wallet/getGameBalanceById', balancePlayer);

  return (dispatch) =>
    request.then((response) => {
      if (response.data.status === '0') {
        dispatch({
          type: GET_BALANCE,
          payload: response.data.game_balance,
        })
      } else {
        alert(response.data.message)
      }
    }
    );
}

export function transferMoney(submitData) {
  const request = api.post('/wallet/transferMoney', submitData);

  return (dispatch) =>
    request.then((response) => {
      if (response.data.status === '0' && response.data.success === true) {

        dispatch({
          type: TRANSFER_SUCCESS,
          payload: response.data.doc,
          amount: submitData.Amount
        })
      } else {
        alert(response.data.message)
      }
    }
    );
}

export function setInitSuccess() {
  return (dispatch) => {
    dispatch({
      type: TRANSFER_INIT,
    })
  }
}

export function getTransactionHistory(userId) {
  return dispatch =>
    api.post('/wallet/getTransactionHistory', {user_id: userId}).then(res => {
      if(res.data.success === true) {
        dispatch({
          type: GET_TRANSACTION_HISTORY_SUCCESS,
          payload: res.data.doc
        })
      }
    })
    .catch(error => {
      return dispatch({
        type: GET_TRANSACTION_HISTORY_ERROR,
        payload: error
      })
    }) 
} 

export function getMinWdAmount() {
  return (dispatch) => {
    api.get('/wallet/getMinWdAmount').then(res => {
      if(res.data.success === true) {
        return dispatch({
          type: GET_MINAMOUNT_SUCCESS,
          payload: res.data.doc
        })
      }
    })
  }
}









