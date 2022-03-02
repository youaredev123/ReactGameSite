import React, { Component } from 'react';
import { withStyles, Button, Card, CardContent, TextField, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import api from '../../ApiConfig';
import _ from 'lodash';

const styles = theme => ({
  root: {
    background: '#3c4252',
    color: '#fff',
    height: '100vh'
  },
  loginForm: {
    height: '100vh',
    width: 400,
    float: 'right'
  },
});

class ResetPassword extends Component {

  state = {
    email: '',
    password: '',
    passwordConfirm: '',
    error: '',
    password_updated: '',
  };

  async componentDidMount() {

    await api.get('/auth/resetPassword', {
      params: {
        resetPasswordToken: this.props.match.params.token,
      },
    }).then(res => {

      if (res.data.message === 'password reset link a-ok') {
        this.setState({
          email: res.data.email,
          error: 'false',
        })
      } else {
        this.setState({
          error: 'true'
        })
      }
    }).catch(error => {
      console.log(error)
    })
  }


  handleChange = (event) => {
    this.setState(_.set({ ...this.state }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
  };

  canBeSubmitted() {
    const { email, password, passwordConfirm } = this.state;
    return (
      email.length > 0 &&
      password.length > 0 &&
      password.length > 3 &&
      password === passwordConfirm
    );
  }

  updatePassword = () => {

    var updateData = {
      email: this.state.email,
      password: this.state.password,
    }

    api.post('/auth/updatePasswordViaEmail', updateData).then(response => {
      if (response.data.message === 'pasword updated') {
        this.setState({
          password_updated: 'true',
          error: 'false'
        })

        alert('success');

      } else {
        this.setState({
          password_updated: 'false',
          error: 'true'
        })
      }
    }).catch(error => {
      console.log(error.data)
    })

  }

  render() {
    const { classes } = this.props;
    const { email, password, passwordConfirm, password_updated } = this.state;

    return (
      <div className={classNames(classes.root, "d-flex justify-content-between")}>

      <div className="animated fadeIn" style = {{paddingTop: '10%', paddingLeft: '10%'}}>
        <img className="w-128 mb-32" src="assets/images/logos/aseanslot.png" alt="logo" />
        <Typography variant="h3" color="inherit" className="font-light">
          Welcome to the FUSE!
        </Typography>
        <Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper nisl erat, vel convallis elit fermentum pellentesque. Sed mollis velit
          facilisis facilisis.
        </Typography>
      </div>

      <div className={classNames(classes.loginForm, "animated fadeIn")}>

          <Card className="" square style = {{height: '100%'}}>

            <CardContent className="text-center mt-4">

              <Typography variant="h6" className="">RESET YOUR PASSWORD</Typography>

              <form name="resetForm" noValidate className="">

                <TextField
                  className="mt-4"
                  label="Email"
                  autoFocus
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  variant="outlined"
                  inputProps={{
                    readOnly: true,
                    disabled: true,
                  }}
                  required
                  fullWidth
                />

                <TextField
                  className="mt-4"
                  label="Password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                  variant="outlined"
                  required
                  fullWidth
                />

                <TextField
                  className="mt-4"
                  label="Password (Confirm)"
                  type="password"
                  name="passwordConfirm"
                  value={passwordConfirm}
                  onChange={this.handleChange}
                  variant="outlined"
                  required
                  fullWidth
                />

                <Button onClick={this.updatePassword} variant="contained" color="primary" className=" mt-4" aria-label="Reset"
                  disabled={!this.canBeSubmitted()}>
                  RESET MY PASSWORD
                </Button>

              </form>
              {password_updated === 'true' && (
                <p>Your password has been successfully reset , please try logging in again!</p>
              )}

              <div className="mt-2">
                <Link className="font-medium" to="/pages/auth/login-2">Go back to login</Link>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ResetPassword);
