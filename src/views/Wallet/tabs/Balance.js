import React, { Component } from 'react';
import { withStyles, Typography, TextField, MenuItem, Button } from '@material-ui/core';
import api from '../../../ApiConfig';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../../state/actions';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


const styles = theme => ({

  textField: {
    marginLeft: 10,
    marginRight: 10,
    width: '200px'
  },
  transferAmount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  menu: {
    width: 200,
  },

  margin: {
    margin: 10,
  },
  result_message: {
    position: 'relative',
    marginTop: 100
  }
})

const directions = [
  {
    key: 1,
    value: 'Main Balance',
    label: 'Main Balance',
  },
  {
    key: 2,
    value: 'Game Balance',
    label: 'Game Balance',
  }
];


class Balance extends Component {

  constructor(props){
    super(props);
    this.clickCount = 0;
    this.singleClickTimer = '';
  }
  state = {
    remaining_balance: '',
    currency: '',
    PlayerId: '',
    MerchantCode: process.env.REACT_APP_MARCHANT_CODE,
    ProductWallet: 101,
    TransactionId: 'Transaction_',
    Amount: 25.00,
    transfer_amount: '',
    amount_from: '',
    amount_to: '',
    open: false,
    openModal: true,
  };

  componentDidMount() {
    this.getUserBankInfo();
    this.getGameBalance();
  }


  singleClick = () => {
    console.log('only fire click')
    this.onSubmit();
    this.setStatInit();
    
  }

  handleDoubleClick = () => {
    console.log('double click fire')
    this.onSubmit();
    this.setStatInit();

  }

  handleClicks(){
    this.clickCount++;
    if (this.clickCount === 1) {
        this.singleClickTimer = setTimeout(function() {
        this.clickCount = 0;
        this.singleClick();
      }.bind(this), 300);

    } else if (this.clickCount === 2) {
      clearTimeout(this.singleClickTimer);
      this.clickCount = 0;
      this.handleDoubleClick();
    }
  }

  setStatInit = () => {
    this.setState({
      transfer_amount: '',
      amount_from: '',
      amount_to: '',
      open: false,
    })
  }

  handleChangePage = (event, newPage) => {
    this.setState({ rowsPerPage: newPage })
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value })

  };

 
  getUserBankInfo = () => {
    var _id = this.props.user_id

    api.post('/profile/getUserBankInfoById', { id: _id }).then(res => {
      const resData = res.data.doc;
      res.data.doc &&
        this.setState({ remaining_balance: resData.remaining_balance, currency: resData.currency });
    });
  }

  getGameBalance = () => {

    api.post("/player/getPlayerIdByUserId", {user_id: this.props.user._id}).then(res => {
      if(res.data.success) {

        this.setState({PlayerId: res.data.doc.PlayerId});

        const balancePlayer = {
          user_id: this.props.user._id,
          MerchantCode: this.state.MerchantCode,
          PlayerId: this.state.PlayerId,
          ProductWallet: this.state.ProductWallet
        }
        this.props.getCurrentGameBalance(balancePlayer);

      } else {
        alert(res.data.message)
      }
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChangeTransferAmount = name => event => {
    this.setState({
      [name]: event.target.value.replace(/[^0-9]/g, '')
    });
  };


  canBeSubmitted() {
    const { amount_from, amount_to, transfer_amount } = this.state;
    return (
      amount_from !== amount_to && 
      amount_from !== '' && 
      amount_to !== '' &&
      parseFloat(transfer_amount) > 0
    );
  }

  //making transaction id
  createUUID = () => {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
  }

  onSubmit = () => {
    const { gamebalance } = this.props;
    if (parseFloat(this.state.transfer_amount.replace(/[^0-9]/g, '')) > parseFloat(this.state.remaining_balance) && this.state.amount_from === 'Main Balance') {
      alert('you can not send this amount. amount should be less than Main Balance')
    } else if (parseFloat(this.state.transfer_amount.replace(/[^0-9]/g, '')) > parseFloat(gamebalance.Balance) && this.state.amount_from === 'Game Balance') {
      alert('you can not get this amount. amount should be less than Game balance')
    } else {
      var current_transaction_id = this.state.TransactionId + this.createUUID();

      const submitData = {
        user_id: this.props.user._id,
        PlayerId: this.state.PlayerId,
        MerchantCode: this.state.MerchantCode,
        ProductWallet: this.state.ProductWallet,
        TransactionId: current_transaction_id,
        Amount: this.state.transfer_amount.replace(/[^0-9]/g, ''),
        amount_from: this.state.amount_from,
        amount_to: this.state.amount_to
      }
     
      this.props.transferMoney(submitData);
    }
  }

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  toggle = () => {
    this.getUserBankInfo();
    this.getGameBalance();
    this.setInitialTransactionSuccess();
  }

  setInitialTransactionSuccess = () => {
    this.props.setInitSuccess();
  }

  render() {
    const { classes, gamebalance, transfer_result_message, t, transferAmount } = this.props;
    const { remaining_balance, currency } = this.state;

    return (
      <div className="d-flex p-4">
        <div className="transfer-form">
          <div className="remaining-balance">
            {remaining_balance === '' ? (
              <Typography className="">
                {t('mainBalance.label')} 0 {currency}
              </Typography>
            ) :
              (
                <Typography className="">
                {t('mainBalance.label')} {parseFloat(remaining_balance).toLocaleString()} {currency}
                </Typography>
              )}

          </div>

          <div className="game-balance">
            <Typography className="">
              {t('gameBalance.label')} { parseFloat(gamebalance.Balance).toLocaleString()} {gamebalance.Currency}
            </Typography>
          </div>

          <div className="d-flex justify-content-center align-items-center">
            <Typography className="">
              {t('transfer.label')}
            </Typography>
            <TextField
              type="number"
              id="transfer-amount"
              label="Amount(IDR)"
              className={classes.textField}
              value={this.state.transfer_amount}
              onChange={this.handleChangeTransferAmount('transfer_amount')}
              margin="normal"
              variant="outlined"
            />
          </div>

          <div className="ml-40">
            <div className="d-flex align-items-center justify-content-between">
              <Typography className="">
                {t('from.label')}
              </Typography>
              <TextField
                id="from-amount"
                select
                label="Select"
                className={classes.textField}
                value={this.state.amount_from}
                onChange={this.handleChange('amount_from')}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}
                margin="normal"
                variant="outlined"
              >
                {directions.map(option => (
                  <MenuItem key={option.key} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="d-flex align-items-center justify-content-between">
              <Typography className="">
                {t('to.label')}
              </Typography>
              <TextField
                id="to-amount"
                select
                label="Select"
                className={classes.textField}
                value={this.state.amount_to}
                onChange={this.handleChange('amount_to')}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}
                margin="normal"
                variant="outlined"
              >
                {directions.map(option => (
                  <MenuItem key={option.key} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <Button onClick={() => this.handleClicks()} variant="contained" color="primary" className="mt-4 float-right" aria-label="LOG IN"
              disabled={!this.canBeSubmitted()}>
              {t('transfer.label')}
            </Button>
          </div>

          <div className={classes.result_message}>
              {transfer_result_message !== undefined && transfer_result_message !== '' && (
                <Modal isOpen={this.state.openModal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>Confirm </ModalHeader>
                <ModalBody>
                  Transaction have done successfully 
                  Amount: {parseFloat(transferAmount).toLocaleString()}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.toggle}>Ok</Button>{' '}
                </ModalFooter>
              </Modal>
              )}
          </div>

        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getCurrentGameBalance: Actions.getCurrentGameBalance,
    transferMoney: Actions.transferMoney,
    setInitSuccess: Actions.setInitSuccess,
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    user: state.user,
    gamebalance: state.wallet.imoneBalance,
    transfer_result_message: state.wallet.transfer_result_message,
    transferAmount: state.wallet.transferAmount
  }
}

Balance.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withTranslation()(withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(Balance)));
