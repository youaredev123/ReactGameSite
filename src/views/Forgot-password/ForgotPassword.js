import React, { Component } from 'react';
import { withStyles, Button, Card, CardContent, TextField, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import api from '../../ApiConfig';
import { withTranslation } from 'react-i18next';

const styles = theme => ({
  root: {
    background: '#3c4252',
    color: '#fff',
    height: '100vh'
  },
  resetForm: {
    height: '100vh',
    width: 400,
    float: 'right'
  }
});

class ForgotPassword extends Component {

  state = {
    email: '',
    showError: false,
    messageFromServer: '',
  };

  handleChange = (event) => {
    this.setState(_.set({ ...this.state }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
  };

  canBeSubmitted() {
    const { email } = this.state;
    return (
      email.length > 0
    );
  }

  formSubmit = () => {

    const email = this.state.email;
    if (email === '') {
      this.setState({
        showError: true,
        messageFromServer: 'Email will not be blank'
      });
    } else {
      api.post('/auth/forgotPassword', { email: email }).then(response => {
        if (response.data.message === 'email not registered') {
          this.setState({
            showError: true,
            messageFromServer: response.data.message
          });
        } else if (response.data.message === 'recovery mail sent' && response.data.success === true) {
          this.setState({
            showError: false,
            messageFromServer: 'recovery mail sent'
          });
        }
      })
        .catch(error => {
          console.log('error=>', error)
        })
    }
  }

  render() {
    const { classes, t } = this.props;
    const { email, messageFromServer } = this.state;

    return (
      <div className={classNames(classes.root, "d-flex justify-content-between")}>

          <div className="animated fadeIn" style = {{paddingTop: '10%', paddingLeft: '10%'}}>
            <img className="" src="assets/images/logos/aseanslot.png" alt="logo" />
            <Typography variant="h3" color="inherit" className="font-weight-light">
              {t('forgotPassworTitle.label')}
            </Typography>
            <Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16">
              {t('forgotPassworSubTitle.label')}
            </Typography>
          </div>


        <div className={classNames(classes.resetForm, "animated fadeIn")}>

          <Card className="" square style = {{height: '100%'}}>

            <CardContent className="text-center mt-4">

              {messageFromServer === 'recovery mail sent' && (
                <Typography variant="h6" className="">Recovery Mail Sent.</Typography>
              )}

              <Typography variant="h6" className="">RECOVER YOUR PASSWORD</Typography>

              <form name="recoverForm" noValidate className="">

                <TextField
                  className="mt-4"
                  label={t('fgEmail.label')}
                  autoFocus
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  variant="outlined"
                  required
                  fullWidth
                />
                {messageFromServer === 'email not registered' && (
                  <div>
                    <p>Email not registered</p>
                  </div>
                )}
                {messageFromServer === 'recovery mail sent' && (
                  <div>
                    <p>Password Reset Email Successfully sent</p>
                  </div>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  className="mt-4"
                  aria-label="Reset"
                  disabled={!this.canBeSubmitted()}
                  onClick={this.formSubmit}
                >
                  {t('fgBtn.label')}
                  </Button>

              </form>

              <div className="mt-2">
                <Link className="font-medium" to="/login">{t('fgGoBack.label')}</Link>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

export default withTranslation()(withStyles(styles, { withTheme: true })(ForgotPassword));
