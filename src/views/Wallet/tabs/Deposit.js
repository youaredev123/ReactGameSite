import React, { Component } from 'react';
import { withStyles, Typography, TextField, Button, Snackbar} from '@material-ui/core';
import classNames from 'classnames';
import api from '../../../ApiConfig';
import PropTypes from 'prop-types';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MenuItem from '@material-ui/core/MenuItem';
import socket from '../../../SocketConfig';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import i18n from "i18next";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles = theme => ({
  root: {
    height: '70vh'
  },
  textField: {
    marginLeft: 10,
    marginRight: 10,
  },
  margin: {
    margin: 10,
    marginTop: '15%'
  },
  bankInfo: {
    width: '30%'
  }
})

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: 10,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
})

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

MySnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

class Deposit extends Component {

  constructor(props){
    super(props);
    this.clickCount = 0;
    this.singleClickTimer = '';
  }

  state = {
    open: false,
    deposit_status: '',
    deposit_amount: '',
    bank_name: '',
    bank_account_name: '',
    bank_account_num: '',
    available_banks: [],

    success_msg: "Your request was sent successfully. please wait till this request will be approved!"

  };

  componentDidMount() {
    this.getAvailableBankInfo();
 
    let current_lang = i18n.language;
    if(current_lang === 'in') {
      this.setState({success_msg: 'Permintaan Anda berhasil dikirim. harap tunggu hingga permintaan ini disetujui!'})
    }
  }

  getAvailableBankInfo = () => {
    api.post('/wallet/getAvailableAdminBanks').then(res => {
      const resData = res.data.doc;
      var banks = [];
      resData.map((cur, key) => {
        banks.push({key: cur._id, value: cur.bank_name})
        return key
      })
      this.setState({available_banks: banks})
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleChangeDepositAmount = name => event => {
    this.setState({
      [name]: event.target.value.replace(/[^0-9]/g, '')
    });
  }

  canBeSubmitted() {
    const { deposit_amount, bank_name } = this.state;
    return (
      deposit_amount.length > 0 &&
      bank_name.length > 0 && 
      parseFloat(deposit_amount) > 0
    );
  }

  onSubmit = () => {

    let current_lang = i18n.language
    api.post('/wallet/getDepoPendingStatus', {user_id: this.props.user_id}).then(res => {
      console.log()
      if(res.data.success  === true) {
        if(res.data.pending_status === true) {
          if(current_lang === 'in') {
            alert('status deposit Anda sebelum permintaan sudah tertunda .. harap tunggu hingga permintaan Anda disetujui.')
          } else {
            alert('your before deposit request have already pending status.. please wait until your request will be approved.')
          }
        } else {

          const depositData = {
            user_id: this.props.user_id,
            user_name: this.props.user_name,
            deposit_amount: this.state.deposit_amount.replace(/[^0-9]/g, ''),
            bank_name: this.state.bank_name,
          }

          if (parseFloat(depositData.deposit_amount) < this.props.minAmount[0].min_deposit_amount) {
            alert('you can not deposit less than ' + this.props.minAmount[0].min_deposit_amount)
          } else {
            api.post('/wallet/requestDeposit', depositData).then(res => {
              if (res.data.success === true) {
                this.setState({ open: true });
                socket.emit('request:deposit', res.data.doc);
              }
            })
          }

        }
      } else {
        alert('can not get pending status by some reson')
      }
    })
  }

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  singleClick = () => {
    console.log('only fire click')
    this.onSubmit();
  }

  handleDoubleClick = () => {
    console.log('double click fire')
    this.onSubmit();
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


  render() {
    const { classes, t } = this.props;

    return (
      <div className={classNames(classes.root, "p-24")}>

          <div className="">
            <Snackbar
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              open={this.state.open}
              autoHideDuration={6000}
              onClose={this.handleClose}
            >
              <MySnackbarContentWrapper
                variant="success"
                className={classes.margin}
                message={this.state.success_msg}
              />
            </Snackbar>
          </div>

 
        <div className="">
          <div className="d-flex align-items-center">
            <div className="pl-4">
              <Typography className="">
                {t('depositAccount.label')}
              </Typography>
            </div>    
            <TextField
              id="deposit_amount"
              label=" IDR "
              className={classes.textField}
              value={this.state.deposit_amount}
              onChange={this.handleChangeDepositAmount('deposit_amount')}
              margin="normal"
              variant="outlined"
              type="number"
            />    
          </div>

          <div className="d-flex align-items-center">
            <div className="pl-4">
              <Typography className="">
                {t('bankInfo.label')}
            </Typography>
            </div>
            <div className = {classes.bankInfo}>
            <TextField
              id="select_bank_name"
              select
              label="Select"
              className={classes.textField}
              value={this.state.bank_name}
              onChange={this.handleChange('bank_name')}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Please select Bank"
              margin="normal"
              variant="outlined"
              fullWidth
            >
              {this.state.available_banks.map(option => (
                <MenuItem key={option.key} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </TextField>
            </div>
          </div>

          <div className="pl-4 mt-4">
            <Button onClick={() => this.handleClicks()} variant="contained" color="primary" className="" aria-label="Register"
                disabled={!this.canBeSubmitted()}>
                {t('deposit.label')}
              </Button>
          </div>
         
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    minAmount: state.wallet.minAmount,
  }
}

export default withTranslation()(withStyles(styles, { withTheme: true })(connect(mapStateToProps, null)(Deposit)));


