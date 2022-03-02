import React, { Component } from 'react';
import { withStyles, Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, TextField, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import * as Actions from '../../state/actions';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import api from '../../ApiConfig';
import metaService from '../../services/metaService';

// import ReCAPTCHA from "react-google-recaptcha";

const styles = theme => ({
  root: {
    background: '#3c4252',
    color: '#fff',
  },
  leftForm: {
    display: 'none'
  },
  termLabel: {
    display: 'flow-root'
  },
  errorText: {
    color: 'red',
    float: 'left'
  },
  errorTextExist: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16
  },
  selectField: {
    width: '100%'
  }
});


class Register extends Component {

  state = {
    name: '',
    email: '',
    password: '',
    phone_number: '',
    bank_name: '',
    bank_account_num: '',
    bank_account_name: '',
    passwordConfirm: '',
    acceptTermsConditions: false,
    captcha_value: null,

    banks: [],
    logo_url: ''
  };

  componentDidMount() {

    metaService.getMetaInfo().then(res => {
      this.setState({logo_url: res.logo_url})
    })
    .catch(message => {
      console.log(message)
    })

    this.getBankNames();
  }

  getBankNames = () => {

    api.post('/wallet/getAvailableAdminBanks').then(res => {
      if (res.data.success === true) {
        let resData = res.data.doc;
        let arrayData = [];
        resData.map(item => {
          arrayData.push(item.bank_account_name);
          return true;
        })
        arrayData.unshift('');

        this.setState({ banks: arrayData })

      }
    })
  }

  handleChange = (event) => {
    this.setState(_.set({ ...this.state }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
  };

  canBeSubmitted() {
    const { email, password, passwordConfirm, acceptTermsConditions } = this.state;
    return (
      email.length > 0 &&
      password.length > 0 &&
      password.length > 3 &&
      password === passwordConfirm &&
      acceptTermsConditions
    );
  }

  handleChangeBank = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit = () => {

    const userData = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      phone_number: this.state.phone_number,
      bank_name: this.state.bank_name,
      bank_account_num: this.state.bank_account_num,
      bank_account_name: this.state.bank_account_name,
      acceptTermsConditions: this.state.acceptTermsConditions,
      captcha_value: this.state.captcha_value,

      MerchantCode: process.env.REACT_APP_MARCHANT_CODE,
      PlayerId: process.env.REACT_APP_IMONE_PREFIX + this.state.name,
      Currency: "IDR",
      Password: this.state.password,
      Country: "ID",
      Sex: "M",
      BirthDate: "19701128"
    }

     this.props.submitRegister(userData)
  }

  captchaOnChange = (value) => {
    this.setState({ captcha_value: value });
  }

  handleOnLoad = () => {
    console.log('aaa');
  }

  goToHome = () => {
    this.props.history.push('/home')
  }

  handleSubmitForm = () => {
    console.log('form submitted')
  }

  render() {
    const { classes, error, t } = this.props;
    const { name, email, password, phone_number, passwordConfirm, acceptTermsConditions, bank_name, bank_account_num, bank_account_name, banks, logo_url } = this.state;

    return (
      <div className={classNames(classes.root, "d-flex justify-content-between")}>
        <div className={window.innerWidth < 768 ? classNames(classes.leftForm, "animated fadeIn") : "animated fadeIn"} style={{ padding: 30 }}>
          <img className="" src={logo_url} alt="logo" onClick={this.goToHome} width = "150px"/>
         
          <Typography variant="h3" color="inherit" className="font-weight-light">
            {t('rg-title')}
          </Typography>
          <Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16">
            please create account
          </Typography>
        </div>

        <div className="animated fadeIn" style={{ width: 400, height: '100vh' }}>
          <Card className="" square style={{ height: '100%', overflow: 'scroll' }}>
            <CardContent className="text-center">
              <img className="" src={logo_url} alt="logo" onClick={this.goToHome} width = "150px"/>
             
              <Typography variant="h6" className="mt-4 mb-4">{t('rgaccount-title.label')}</Typography>

              {error.imone_already_exist && (
                <Typography variant="caption" className={classes.errorTextExist}>{error.imone_already_exist}</Typography>
              )}
              <ValidatorForm
                ref="form"
                onSubmit={this.handleSubmitForm}
                onError={errors => console.log(errors)}
              >
                <TextField
                  className="mb-4"
                  label={t('rgName.label')}
                  autoFocus
                  type="name"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                  variant="outlined"
                  required
                  fullWidth
                />
                {error.name_error && (
                  <Typography variant="caption" className={classes.errorText}>{error.name_error}</Typography>
                )}

                <TextField
                  className="mb-4"
                  label={t('rgEmail.label')}
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  variant="outlined"
                  required
                  fullWidth
                />
                {error.email_error && (
                  <Typography variant="caption" className={classes.errorText}>{error.email_error}</Typography>
                )}
                <TextValidator
                  className="mb-4"
                  label={t('password.label')}
                  name="password"
                  type="password"
                  autoComplete="false"
                  value={password}
                  margin="normal"
                  variant="outlined"
                  required
                  fullWidth
                  onChange={this.handleChange}
                  validators={['matchRegexp:^[0-9a-zA-Z]{5,40}$']}
                  errorMessages={['password should be at least 5 characters and only number and alphabet charaters']}
                />

                <TextField
                  className="mb-4"
                  label={t('rgPasswordConfirm.label')}
                  type="password"
                  name="passwordConfirm"
                  value={passwordConfirm}
                  onChange={this.handleChange}
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextField
                  className="mb-4"
                  label={t('rgPhoneNumber.label')}

                  type="number"
                  name="phone_number"
                  value={phone_number}
                  onChange={this.handleChange}
                  variant="outlined"
                  required
                  fullWidth
                />

                <TextField
                  id="choose_bank"
                  select
                  label={t('rgChooseBank.label')}
                  className={classes.selectField}
                  value={bank_name}
                  onChange={this.handleChangeBank('bank_name')}
                  SelectProps={{
                    native: true,
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                  helperText=" "
                  margin="normal"
                  variant="outlined"
                >

                  {banks.map((item, index) => {
                    return (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    )

                  })}
                </TextField>

                <TextField
                  className="mb-4"
                  label={t('rgBankAccountNumber.label')}

                  type="text"
                  name="bank_account_num"
                  value={bank_account_num}
                  onChange={this.handleChange}
                  variant="outlined"
                  required
                  fullWidth
                />

                {error.banknumber_error && (
                  <Typography variant="caption" className={classes.errorText}>{error.banknumber_error}</Typography>
                )}

                <TextField
                  className="mb-4"
                  label={t('rgBankAccountName.label')}
                  type="text"
                  name="bank_account_name"
                  value={bank_account_name}
                  onChange={this.handleChange}
                  variant="outlined"
                  required
                  fullWidth
                />

                {/* <ReCAPTCHA
                  ref="recaptcha"
                  sitekey="6LemarUUAAAAAHHQ4rjAtTHULus9jpKYGZ-U0OmH"
                  onLoad={this.handleOnLoad}
                  onChange={this.captchaOnChange}
                /> */}

                <FormControl className="" >
                  <FormControlLabel
                    classes={{
                      root: classes.termLabel, // class name, e.g. `root-x`
                    }}
                    control={
                      <Checkbox
                        name="acceptTermsConditions"
                        checked={acceptTermsConditions}
                        onChange={this.handleChange} 
                        color="primary"
                      />
                    }
                    label={t('rgTerms.label')}
                    labelPlacement="end"
                  />
                </FormControl>

                <Button onClick={this.handleSubmit} variant="contained" color="primary" className="w-full mx-auto mt-16" aria-label="Register"
                  disabled={!this.canBeSubmitted()}>
                  {t('rgCreateBtn.label')}
                </Button>

              </ValidatorForm>

              <div className="mt-4">
                <span className="font-medium">{t('rgalreadyAccount.label')}</span>
                <Link className="font-medium" to="/login">{t('rgLogin.label')}</Link>
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
    submitRegister: Actions.submitRegister
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    error: state.auth
  }
}


export default withTranslation()(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Register))));
