import { combineReducers } from 'redux';
import auth from './auth.reducer';
import homeslotes from './homeslots.reducer';
import user from './user.reducer';
import wallet from './wallet.reducer';

export default combineReducers({
    auth,
    homeslotes,
    user,
    wallet
});
