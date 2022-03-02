import React, { Component } from 'react';
import { withStyles, Button, Typography } from '@material-ui/core';
import api from '../../../ApiConfig';
import TextField from '@material-ui/core/TextField';
import _ from 'lodash';


const styles = theme => ({

});

const newProfile = {
  profileData: {
    name: '',
    email: '',
    phone_number: '',
    bank_name: '',
    bank_account_num: '',
    bank_account_name: '',
    avatar: '',
    account_status: '',
  }
}

class AboutTab extends Component {

  state = { ...newProfile };

  componentDidMount() {
    this.getUserProfile();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(this.props.location, prevProps.location) || this.props.user_id !== prevProps.user_id) {
      this.getUserProfile();
    }
  }

  getUserProfile = () => {
    var _id = this.props.user_id
    api.post('/profile/getUserProfileById', { id: _id }).then(res => {
      res.data.doc &&
        this.setState({ profileData: res.data.doc });
    });
  }

  handleChange = name => event => {
    var cursor = this.state.profileData;
    cursor[name] = event.target.value;
    this.setState({
      profileData: cursor,
    });
  };

  handleSave = () => {
    var profile = this.state.profileData;
    api.post('/profile/saveUserProfileById', {
      profile
    }).then(res => {
      if (res.data.success === true) {
        alert('success')
      }
    })
  }

  handleClear = () => {
    this.setState(newProfile);
  }

  render() {
    return (
      <div className="md:flex max-w-full">
        <div className="flex flex-col md:w-512">
          <div className="animated fadeIn">
            <TextField
              className="mb-24 mx-8"
              label="User Name"
              id="user_name "
              name="birth_name"
              value={this.state.profileData.name}
              onChange={this.handleChange('name')}
              margin="normal"
              inputProps={{
                readOnly: true,
                disabled: true,
              }}
            />
            <TextField
              className="mb-24 mx-8"
              label="Email"
              id="email"
              name="email"
              value={this.state.profileData.email}
              onChange={this.handleChange('email')}
              margin="normal"
            />

            <TextField
              className="mb-24 mx-8"
              label="Nomor Telepon"
              id="phone_number"
              name="phone_number"
              value={this.state.profileData.phone_number}
              onChange={this.handleChange('phone_number')}
              margin="normal"
            />

            <div className="flex">
              <Typography variant="subtitle1" color="inherit" className="min-w-160 pt-20">
                Account Status :
              </Typography>
              <TextField
                className="text-danger"
                inputProps={{
                  readOnly: true,
                  disabled: true,
                }}
                required
                // fullWidth={true}
                name="account_status"
                margin="normal"
                value={this.state.profileData.account_status}
                onChange={this.handleChange('account_status')}
              />
            </div>
          </div>
        </div>

        <div className="mr-60 mt-4">
          <div className="animated fadeIn">
            <div className="flex">
              <Button variant="contained" className="" onClick={this.handleSave} >
                Save
                </Button>
              <Button variant="contained" color="secondary" className="ml-4" onClick={this.handleClear}>
                Clear
                </Button>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default withStyles(styles)(AboutTab);
