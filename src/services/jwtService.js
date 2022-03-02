import api from '../ApiConfig'

class JwtService {

  signInWithEmailAndPassword = (loginCredentials) => {
    return new Promise((resolve, reject) => {
      api.post('/auth/login', loginCredentials).then(response => {
          if ( response.data.decodedToken && response.data.userData )
          {
            this.setSession(response.data.access_token);
            resolve(response.data.userData);
          }
          else
          {
            this.setSession(null);
            reject(response.data.message);
          }
      });
    });
  };

  setSession = access_token => {
    if ( access_token )
    {
        localStorage.setItem('jwt_access_token', access_token);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
    }
    else
    {
        localStorage.removeItem('jwt_access_token');
        delete api.defaults.headers.common['Authorization'];
    }
};


  getAccessToken = () => {
    return window.localStorage.getItem('jwt_access_token');
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      api.post('/auth/register', data)
        .then(response => {
          if ( response.data.success === true )
          {
            resolve(response.data.doc);
          }
          else
          {
            reject(response.data.message);
          }
        });
    });
  };

  logout = () => {
    this.setSession(null);
  };


}

const jwtService = new JwtService();

export default jwtService;