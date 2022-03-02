import React, { Component } from 'react';
import { withStyles, Button } from '@material-ui/core';
import api from '../../../ApiConfig';
import TextField from '@material-ui/core/TextField';
import _ from '@lodash';


const styles = theme => ({
  textField: {
    marginLeft: 10,
    marginRight: 10,
    width: 200,
  },
  menu: {
    width: 200,
  },
});

const bankStatus = [
  {
    value: 'activated',
    label: 'Activated'
  },
  {
    value: 'restricted',
    label: 'Restricted'
  }
]

const bankNames = [
  {
    value: '0',
    label: '',
  },
  {
    value: 'PT Bank ANZ Indonesia, formerly PT ANZ Panin Bank',
    label: 'PT Bank ANZ Indonesia, formerly PT ANZ Panin Bank',
  },
  {
    value: 'PT Bank Agroniaga Tbk',
    label: 'PT Bank Agroniaga Tbk.',
  },
  {
    value: 'PT Bank Artha Graha Internasional Tbk',
    label: 'PT Bank Artha Graha Internasional Tbk',
  },
];

const bankInfo = {
  bankInfoData: {
    user_id: '',
    bank_name: '',
    bank_account_num: '',
    bank_account_name: '',
    bank_account_status: '',
    remaining_balance: ''
  }
}

class BankInfo extends Component {

  state = { ...bankInfo };

  componentDidMount() {
    this.getUserBankInfo();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(this.props.location, prevProps.location) || this.props.user_id !== prevProps.user_id) {
      this.getUserBankInfo();
    }
  }

  getUserBankInfo = () => {
    var _id = this.props.user_id
    api.post('/profile/getUserBankInfoById', { id: _id }).then(res => {
      res.data.doc &&
        this.setState({ bankInfoData: res.data.doc });
    });
  }

  handleChange = name => event => {
    var cursor = this.state.bankInfoData;
    cursor[name] = event.target.value;
    this.setState({
      bankInfoData: cursor,
    });
  };

  handleSave = () => {
    var profile = this.state.bankInfoData;
    api.post('/profile/saveUserBankDataById', {
      profile
    }).then(res => {
     if(res.data.success === true) {
      // successMessage = 'Data saved successfully'
      alert('data saved successfully')
     }
    })
  }

  handleClear = () => {
    this.setState(bankInfo);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="md:flex max-w-full">
        <div className="flex flex-col md:w-512">
          <FuseAnimateGroup
            enter={{
              animation: "transition.slideUpBigIn"
            }}
          >
            <TextField
              className="mb-24 mx-8"
              id="bank_name"
              select
              label="Nama Bank"
              name="bank_name"
              value={this.state.bankInfoData.bank_name}
              onChange={this.handleChange('bank_name')}
              SelectProps={{
                native: true,
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin="normal"
            >
              {bankNames.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>

            <TextField
              className="mb-24 mx-8"
              label="Nama Rek Bank"
              id="bank_account_name"
              name="bank_account_name"
              value={this.state.bankInfoData.bank_account_name}
              onChange={this.handleChange('bank_account_name')}
              margin="normal"
            />

            <TextField
              className="mb-24 mx-8"
              label="Nomer Rek Bank"
              id="bank_account_num"
              name="bank_account_num"
              value={this.state.bankInfoData.bank_account_num}
              onChange={this.handleChange('bank_account_num')}
              margin="normal"
            />

            <TextField
              className="mb-24 mx-8"
              id="bank_account_status"
              select
              label="Bank Account Status"
              name="bank_account_status"
              value={this.state.bankInfoData.bank_account_status}
              onChange={this.handleChange('bank_account_status')}
              SelectProps={{
                native: true,
                MenuProps: {
                  className: classes.menu,
                },
              }}
              margin="normal"
            >
              {bankStatus.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>

            <TextField
              className="mb-24 mx-8"
              id="remaining_balance"
              label="Sisa Saldo"
              name="remaining_balance"
              value={this.state.bankInfoData.remaining_balance + 'IDR'}
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />

          </FuseAnimateGroup>
        </div>
        <div className="mr-60">
          <FuseAnimateGroup
            enter={{
              animation: "transition.slideUpBigIn"
            }}
          >
            <div className="flex">
              <Button variant="contained" color="secondary" className="m-12 min-w-76" onClick={this.handleSave}>
                Save
                </Button>
              <Button variant="contained" color="secondary" className="m-12 min-w-76" onClick={this.handleClear}>
                Clear
                </Button>
            </div>
          </FuseAnimateGroup>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(BankInfo);
