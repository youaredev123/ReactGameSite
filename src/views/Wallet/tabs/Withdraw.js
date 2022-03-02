import React, { Component } from 'react';
import { withStyles, Typography, TextField, Button, Snackbar } from '@material-ui/core';
import api from '../../../ApiConfig';
import { withTranslation } from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import classNames from 'classnames';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import ErrorIcon from '@material-ui/icons/Error';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import socket from '../../../SocketConfig';
import i18n from "i18next";



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
});

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};


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

class Withdraw extends Component {

  constructor(props){
    super(props);
    this.clickCount = 0;
    this.singleClickTimer = '';
  }

  state = {
    withdraw_amount: '',
    success_msg: '',
    open_snackBar: false,
    currency: '',
    remaining_balance: ''
  };

  componentDidMount() {
    this.getUserBankInfo();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value.replace(/[^0-9]/g, ''),
    });
  };

  canBeSubmitted() {
    const { withdraw_amount } = this.state;
    return (
      withdraw_amount.length > 0 &&
      parseFloat(withdraw_amount) > 0
    );
  }

  handleClose = () => {
    this.setState({ open_snackBar: false });
  };


  onSubmit = () => {

    let current_lang = i18n.language

    api.post('/wallet/getWdPendingStatus', {user_id: this.props.user_id}).then(res => {
      if(res.data.success === true) {

        if ( res.data.pending_status === true) {
          if(current_lang === 'in') {
            alert('status permintaan Anda sebelum penarikan sudah tertunda .. harap tunggu hingga permintaan Anda disetujui.')
          } else {
            alert('your before withdraw request have already pending status.. please wait until your request will be approved.')
          }
        } else {
          let payload = {
            user_id: this.props.user_id,
            user_name: this.props.user_name,
            withdraw_amount: this.state.withdraw_amount.replace(/[^0-9]/g, ''),
          }

          if (this.state.remaining_balance === "") {
            if(current_lang === 'in') {
              alert('Anda tidak dapat menarik uang .. Saldo Anda tidak cukup untuk menarik')
            } else {
              alert('you can not withdraw money.. your balance is not enough to withdraw')
            }
          } else {
            if (parseFloat(payload.withdraw_amount) < this.props.minAmount[0].min_withdraw_amount) {
              if(current_lang === 'in') {
                alert('Anda tidak dapat menarik jumlah kurang dari ' + this.props.minAmount[0].min_withdraw_amount)
              } else {
                alert('you can not withdraw less amount than ' + this.props.minAmount[0].min_withdraw_amount)
              }
            } else {
              if (parseFloat(payload.withdraw_amount) > parseFloat(this.state.remaining_balance)) {
                if(current_lang === 'in') {
                  alert('Anda tidak dapat menarik jumlah ini. masukkan lebih sedikit uang daripada saldo utama Anda!')
                } else {
                  alert('you can not withdraw this amount. please insert less money than your main balance!')
    
                }
              } else {
                api.post('/wallet/withdrawRequest', payload).then(res => {
                  let resData = res.data
                  if (resData.success === true) {
                    if(current_lang === 'in') {
                      this.setState({ success_msg: 'permintaan penarikan Anda berhasil dikirim!', open_snackBar: true })
                    } else {
                      this.setState({ success_msg: 'your withdraw request was sent successfully!', open_snackBar: true })
                    }
                  }
                  socket.emit('request:withdraw', res.data.doc);
                })
              }
            }
          }
        }

      } else {
        alert('can not get pending status for withdraw by some reson')
      }
    })
    
  }

  getUserBankInfo = () => {
    var _id = this.props.user_id
    api.post('/profile/getUserBankInfoById', { id: _id }).then(res => {
      const resData = res.data.doc;
      res.data.doc &&
        this.setState({ remaining_balance: resData.remaining_balance, currency: resData.currency });
    });
  }

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
    const { success_msg } = this.state;
    return (
      <div className={classes.root}>
        <div className="d-flex align-items-center">
          <div className="">
            <Typography className="pl-4">
              {t('withdrawAmount.label')}
            </Typography>
          </div>
          <div className="">
            <TextField
              id="withdraw_amount"
              label=" IDR "
              className={classes.textField}
              value={this.state.withdraw_amount}
              onChange={this.handleChange('withdraw_amount')}
              margin="normal"
              variant="outlined"
              type="number"
            />
          </div>
        </div>
        <div className="pl-4 mt-4">
          <Button onClick={() => this.handleClicks()} variant="contained" color="primary" className="w-full mx-auto mt-16" aria-label="Register"
            disabled={!this.canBeSubmitted()}>
            {t('withdraw.label')}
          </Button>
        </div>
        {this.state.open_snackBar === true && (

            <div className="">
            <Snackbar
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              open={this.state.open_snackBar}
              autoHideDuration={6000}
              onClose={this.handleClose}
            >
              <MySnackbarContentWrapper
                variant="success"
                className={classes.margin}
                message={success_msg}
              />
            </Snackbar>
            </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    minAmount: state.wallet.minAmount,
  }
}

export default withTranslation()(withStyles(styles, { withTheme: true })(connect(mapStateToProps, null)(Withdraw)));
