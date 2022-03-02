import { Component } from "react";
import connect from "react-redux/es/connect/connect";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import jwtService from '../services/jwtService';
import * as Actions from '../state/actions';
import api from '../ApiConfig';
import history from '../history';


class Config extends Component {

  constructor(props) {
    super(props);
    this.domainCheck();
    this.jwtCheck();
  }

  domainCheck = () => {
    let protocol = window.location.protocol;
    if (protocol !== 'http:') {
      window.location.replace(`http:${window.location.href.substring(window.location.protocol.length)}`);
    }
  }

  jwtCheck = () => {
    let token = jwtService.getAccessToken();
    if(token) {
      api.get('/auth/access-token/' + token).then(response => {
        if(response.data.decodedToken) {
          if(response.data.decodedToken.role === 'guest') {
            jwtService.setSession(response.data.access_token);
            this.props.setUserData(response.data.userData)
          }
        } else {
          jwtService.setSession(null);
          history.push('/home');
        }
      }).catch((error) => {
        jwtService.setSession(null);
        history.push('/home')
      })
    } else {
      jwtService.setSession(null);
      history.push('/home');
    }
  }

  render() {
    const { children } = this.props;
    return (
      children
    )
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setUserData: Actions.setUserData
  }, dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(Config));
