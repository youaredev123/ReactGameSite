import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import Deposit from './tabs/Deposit';
import Balance from './tabs/Balance';
import Withdraw from './tabs/Withdraw';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import WalletHistory from './tabs/WalletHistory'
import { bindActionCreators } from 'redux';
import * as Actions from '../../state/actions';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';


const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto'
  },
  tabLinkItem: {
    fontSize: 16,
    fontWeight: 'bold',
    "&:hover": {
      cursor: 'pointer'
    }
  }
})

class Wallet extends Component {

  state = {
    value: 0,
    isOpen: false
  };

  componentDidMount() {
    this.props.getMinWdAmount();
  }

  handleChange = (value) => {
    this.setState({ value: value });
  };

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  render() {
    const { classes, user, t } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>

        <Navbar color="light" light expand="md">
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem style = {{marginRight: 20}}>
              <NavLink><span className = {classes.tabLinkItem} onClick = {() =>this.handleChange(0)}>{t('deposit.label')}</span></NavLink>
            </NavItem>
            <NavItem style = {{marginRight: 20}}>
              <NavLink><span className = {classes.tabLinkItem} onClick = {() => this.handleChange(1)}>{t('withdraw.label')}</span></NavLink>
            </NavItem>
            <NavItem style = {{marginRight: 20}}>
              <NavLink><span className = {classes.tabLinkItem} onClick = {() =>this.handleChange(2)}>{t('myBalance.label')}</span></NavLink>
            </NavItem>
            <NavItem style = {{marginRight: 20}}>
              <NavLink><span className = {classes.tabLinkItem} onClick = {() => this.handleChange(3)}>{t('wallethistory.label')}</span></NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>

        <div >
          {value === 0 && <Deposit user_id={user._id} user_name={user.name} />}
          {value === 1 && <Withdraw user_id={user._id} user_name={user.name} />}
          {value === 2 && <Balance user_id={user._id} user_name={user.name} />}
          {value === 3 && <WalletHistory user_id={user._id} user_name={user.name} />}
        </div>

      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getMinWdAmount: Actions.getMinWdAmount,
    // getWdPendingStatus: Actions.getWdPendingStatus,
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default withTranslation()(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Wallet))));

