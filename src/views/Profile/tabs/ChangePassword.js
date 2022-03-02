import React, { Component } from 'react';
import { withStyles, Button } from '@material-ui/core';
import classNames from 'classnames';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import api from '../../../ApiConfig';
import { Alert } from 'reactstrap'


const styles = theme => ({
  textField: {
    flexBasis: 200,
  },
  margin: {
    margin: 10,
  },
  display: {
    display: 'grid',
  }
});

class ChangePassword extends Component {

  state = {
    current_password: '',
    new_password: '',
    new_password_confirm: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    success: null,
    error: null
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  showCurrentPassword = () => {
    this.setState(state => ({ showCurrentPassword: !state.showCurrentPassword }));
  };

  showNewPassword = () => {
    this.setState(state => ({ showNewPassword: !state.showNewPassword }));
  };

  showConfirmPassword = () => {
    this.setState(state => ({ showConfirmPassword: !state.showConfirmPassword }));
  };

  handleReset = () => {
    const realData = this.state;
    delete realData.showCurrentPassword
    delete realData.showNewPassword
    delete realData.showConfirmPassword
    delete realData.success
    delete realData.error

    if (this.canBeSubmitted() === true) {
      api.post('/auth/changePassword', { id: this.props.id, data: realData }).then(res => {
        console.log('res =>', res)
        if (res.data.success === true) {
          this.setState({success: res.data.message, error: null})
        } else if(res.data.success === false){
          this.setState({success: null, error: res.data.error})
        }
      })

    } else {
      alert('password is not matched or password shoule be at least 4 charaters');
    }
  }

  canBeSubmitted() {
    const { current_password, new_password, new_password_confirm } = this.state;
    return (
      current_password.length > 0 &&
      new_password.length > 3 &&
      new_password_confirm.length > 3 &&
      new_password === new_password_confirm
    );
  }

  handleSave = () => {
    var profile = this.state.profileData;
    api.post('/profile/saveUserProfileById', {
      profile
    }).then(res => {
      window.history.back();
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="max-w-full">
        <div className="w-md flex-col">
          {this.state.success && (
            <Alert color="success">
              {this.state.success}
            </Alert>
          )}
          {this.state.error && (
            <Alert color="danger">
              {this.state.error}
            </Alert>
          )}
          <div className="animated fadeIn">
            <div className={classNames(classes.display)}>
              <FormControl className={classNames(classes.margin, classes.textField)}>
                <InputLabel htmlFor="current_password">Current Password</InputLabel>
                <Input
                  id="current_password"
                  type={this.state.showCurrentPassword ? 'text' : 'password'}
                  value={this.state.current_password}
                  onChange={this.handleChange('current_password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.showCurrentPassword}
                      >
                        {this.state.showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <FormControl className={classNames(classes.margin, classes.textField)}>
                <InputLabel htmlFor="new_password">New Password</InputLabel>
                <Input
                  id="new_password"
                  type={this.state.showNewPassword ? 'text' : 'password'}
                  value={this.state.new_password}
                  onChange={this.handleChange('new_password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.showNewPassword}
                      >
                        {this.state.showNewPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <FormControl className={classNames(classes.margin, classes.textField)}>
                <InputLabel htmlFor="new_password_confirm">Password Confirm</InputLabel>
                <Input
                  id="new_password_confirm"
                  type={this.state.showConfirmPassword ? 'text' : 'password'}
                  value={this.state.new_password_confirm}
                  onChange={this.handleChange('new_password_confirm')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.showConfirmPassword}
                      >
                        {this.state.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
          </div>

          <div className="mr-60">
            <div className="flex">
              <Button variant="contained" color="secondary" className="m-12 min-w-76" onClick={this.handleReset}>
                Reset Password
                </Button>
            </div>
          </div>

        </div>

      </div>
    );
  }
}

export default withStyles(styles)(ChangePassword);
