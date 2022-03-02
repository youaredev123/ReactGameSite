import api from '../../ApiConfig';

export const GET_INITIAL_GAMES = 'GET_INITIAL_GAMES';
export const GET_MORE_GAMES = 'GET_MORE_GAMES';
export const GET_FILTERED_GAMES = 'GET_FILTERED_GAMES';
export const GET_MORE_GAMES_WITH_FILTER = 'GET_MORE_GAMES_WITH_FILTER';

export function getInitailGames() {
  const request = api.post('/player/getInitGames');

  return (dispatch) =>
    request.then((response) => {
      if (response.status === 200) {
        dispatch({
          type: GET_INITIAL_GAMES,
          payload: response.data.doc,
        })
      } else {
        alert('get game vendornames error!')
      }
    }
    );
}

export function saveImslotsGame() {
  const request = api.post('/player/saveImslotsGame');
  return (dispatch) =>
    request.then((response) => {
      console.log('--response data =>', response)
    }
    );
}


export function getMoreGame(gamecounts, vendorNames) {
  if (vendorNames.length === 0) {
    const request = api.post('/player/getMoreGames', { counts: gamecounts });

    return (dispatch) =>
      request.then((response) => {
        if (response.status === 200) {
          dispatch({
            type: GET_MORE_GAMES,
            payload: response.data.doc,
          })
        } else {
          alert('get more games error!')
        }
      }
      );
  } else {
    const request = api.post('/player/getMoreGamesWithFilter', { counts: gamecounts, filterValue: vendorNames });
    return (dispatch) =>
    request.then((response) => {
      if (response.status === 200) {
        dispatch({
          type: GET_MORE_GAMES_WITH_FILTER,
          payload: response.data.doc,
        })
      } else {
        alert('get more games error!')
      }
    }
    );
  }

}


export function filterGames(filterValue) {
  const request = api.post('/player/filterGames', { filterValue: filterValue });

  return (dispatch) =>
    request.then((response) => {
      if (response.status === 200) {
        dispatch({
          type: GET_FILTERED_GAMES,
          payload: response.data.doc,
        })
      } else {
        alert('get more games error!')
      }
    }
    );
}








