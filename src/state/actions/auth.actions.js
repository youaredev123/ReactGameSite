import jwtService from '../../services/jwtService';
import history from '../../history';
import { setUserData } from './user.actions';

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_INVALID = 'LOGIN_INVALID';
export const REGISTER_NAME_ERROR = 'REGISTER_NAME_ERROR';
export const REGISTER_EMAIL_ERROR = 'REGISTER_EMAIL_ERROR';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
export const REGISTER_ALREADY_IMONE = 'REGISTER_ALREADY_IMONE';
export const BANK_NUMBER_DUPLICATE = 'BANK_NUMBER_DUPLICATE';


export function submitRegister(userData)
{
 
  return (dispatch) =>

    jwtService.createUser(userData)
    .then(res => {
        dispatch(setUserData(res));
        history.push({ pathname: '/login'}); 
      }
    )
    .catch(message => {
        
        if(message === 'Username already exists') {
          return dispatch({
            type   : REGISTER_NAME_ERROR,
            payload: message
          });
        } else if(message === 'Email already exists') {
          return dispatch({
            type   : REGISTER_EMAIL_ERROR,
            payload: message
          });
        } else if(message === 'User already Registered in Imone') {
          return dispatch({
            type: REGISTER_ALREADY_IMONE,
            payload: message
          })
        } else if(message === 'Nomer Rek Bank is already exist') {
          return dispatch({
            type: BANK_NUMBER_DUPLICATE,
            payload: message
          })
        }
       
    });
}

export function submitLogin(loginCredentials) {
  return (dispatch) =>
    jwtService.signInWithEmailAndPassword(loginCredentials)
      .then((user) => {
        dispatch(setUserData(user));
        if(user.role === 'guest') {
          history.push('/dashboard');
        } else {
          history.push('/login');
          return dispatch({
            type: LOGIN_INVALID
          });
        }
      }
      )
      .catch(error => {
        return dispatch({
          type: LOGIN_ERROR,
          payload: error
        });
      });
}





