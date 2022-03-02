import React, { Component } from 'react';
import { withStyles, Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, TextField, Typography, SnackbarContent } from '@material-ui/core';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import * as Actions from '../../state/actions';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import i18n from "i18next";

import metaService from '../../services/metaService';

const styles = theme => ({
  root: {
    background: '#3c4252',
    color: '#fff',
    height: '100vh'
  },
  text1: {
    fontSize: '36px',
    marginTop: '5%',
    marginLeft: '50px'
  },
  loginForm: {
    height: '100vh',
    width: 400,
    float: 'right'
  },
  loginCard: {
    height: '100%',
  },
  leftForm: {
    display: 'none'
  }
});

class Login extends Component {

  state = {
    username: '',
    password: '',
    remember: false,
    logo_url: ''
  };

  componentDidMount() {
    metaService.getMetaInfo().then(res => {
      this.setState({logo_url: res.logo_url})
    })
    .catch(message => {
      console.log(message)
    })
  }

  handleChange = (event) => {
    this.setState(_.set({ ...this.state }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
  };

  canBeSubmitted() {
    const { username, password } = this.state;
    return (
      username.length > 0 && password.length > 0
    );
  }

  onSubmit = () => {

    const loginCredentials = {
      username: this.state.username,
      password: this.state.password,
      remember: this.state.remember,
    }
    this.props.submitLogin(loginCredentials);
  }

  goToHome = () => {

    this.props.history.push('/home')
  }

  render() {
    const { classes, login, t } = this.props;
    const { username, password, remember, logo_url } = this.state;

    let current_lang = i18n.language


    return (
      <div className={classNames(classes.root, "d-flex justify-content-between")}>

        <div className={window.innerWidth < 768 ? classNames(classes.leftForm, "animated fadeIn") : "animated fadeIn"} style={{ paddingTop: '10%', paddingLeft: '10%' }}>
          <img src={logo_url} alt="logo" onClick={this.goToHome} width = "150px"/>
        </div>

        <div className={classNames(classes.loginForm, "animated fadeIn")}>
          <Card className={classes.loginCard} square>
            <CardContent className="text-center mt-4">
              <img src={logo_url} alt="logo" onClick={this.goToHome} width = "150px"/>
              {login.error && current_lang === 'in' && (
                <SnackbarContent className={classes.snackbar} message={login.error.in} />
              )}

              {login.error && current_lang === 'en' && (
                <SnackbarContent className={classes.snackbar} message={login.error.en} />
              )}
              <Typography variant="h6" style={{ textAlign: 'center', marginTop: '20%', marginBottom: '20px' }}>{t('loginTitle.label')}</Typography>

              <form name="loginForm" noValidate className="flex ">

                <TextField
                  className="mb-4"
                  label={t('login.username')}
                  type="text"
                  name="username"
                  value={username}
                  onChange={this.handleChange}
                  variant="outlined"
                  required
                  fullWidth
                />

                <TextField
                  className="mb-4"
                  label={t('login.Password')}
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                  variant="outlined"
                  required
                  fullWidth
                />

                <div className="d-flex align-items-center justify-content-between">
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="remember"
                          checked={remember}
                          onChange={this.handleChange} />
                      }
                      label={t('login.rememberme')}
                    />
                  </FormControl>

                  <Link className="font-medium" to="/forgot-password">
                    {t('login.forgotPassword')}
                  </Link>
                </div>

                <Button onClick={this.onSubmit} variant="contained" color="primary" className=" mt-4 " aria-label="LOG IN"
                  disabled={!this.canBeSubmitted()}>
                  {t('login.loginBtn')}
                </Button>
              </form>
              <div className="d-flex flex-col items-center justify-content-center mt-4">
                <span className="font-medium">{t('login.accountQuestion')}</span>
                <Link className="font-medium" to="/register">{t('login.creatAccount')}</Link>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    submitLogin: Actions.submitLogin
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    login: state.auth
  }
}


export default withTranslation()(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))));
