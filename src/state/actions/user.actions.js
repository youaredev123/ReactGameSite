import history from '../../history';
import jwtService from '../../services/jwtService';
import api from '../../ApiConfig';

export const SET_USER_DATA = '[USER] SET DATA';
export const REMOVE_USER_DATA = '[USER] REMOVE DATA';
export const USER_LOGGED_OUT = '[USER] LOGGED OUT';
export const USER_LOGGED_OUT_SESSION_ERROR = 'USER_LOGGED_OUT_SESSION_ERROR';
export const USER_LOGGED_START = 'USER_LOGGED_START';
export const USER_LOGGED_END = 'USER_LOGGED_END';
/**
 * Set User Data
 */
export function setUserData(user) {
  return (dispatch) => {
    dispatch({
      type: SET_USER_DATA,
      payload: user
    })
  }
}


export function logoutUser(terminateSessionData) {

  return (dispatch) => {
    dispatch({
      type: USER_LOGGED_START,
      payload: true
    })
    var promise = new Promise(function(resolve, reject){
      api.post('/player/terminateSession', terminateSessionData).then(res => {
        dispatch({
          type: USER_LOGGED_END,
          payload: false
        })
        if(res.data.success === true || res.data.message === 'Session Does not exist') {
          resolve('Logout Success!');
        } else {
          reject('Could not terminate current session! Please contact support!');
        }
      })
    });

    promise.then(function (message) {     
      dispatch({
        type: USER_LOGGED_OUT,
        payload: message
      })
      jwtService.logout(); 
      history.push('/');  
    })
    .catch(function (message) { 
      dispatch({
        type: USER_LOGGED_OUT_SESSION_ERROR,
        payload: message
      })
    }); 
   

  
  }
}

