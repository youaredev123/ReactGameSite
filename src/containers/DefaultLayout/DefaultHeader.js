import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import { AppSidebarToggler } from '@coreui/react';
import * as Actions from '../../state/actions'
import { withTranslation } from 'react-i18next';

import { css } from "@emotion/core";
import FadeLoader from "react-spinners/FadeLoader";
import api from '../../ApiConfig';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: blue;
`;

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  state = {
    PlayerId: ''
  }

  logout = () => {

    api.post("/player/getPlayerIdByUserId", {user_id: this.props.user._id}).then(res => {
      if(res.data.success) {
        this.setState({PlayerId: res.data.doc.PlayerId});
        let terminateSessionData = {
          MerchantCode: process.env.REACT_APP_MARCHANT_CODE,
          PlayerId: this.state.PlayerId,
          ProductWallet: 101
        }

        console.log(terminateSessionData)
        
        this.props.logoutUser(terminateSessionData);
      } else {
        alert(res.data.message)
      }
    })
  }

  render() {

    const baseAvatarUrl = process.env.REACT_APP_UPLOAD_URL; 

    const {user, t, loading} = this.props;
    return (
      <React.Fragment>
        {loading && (
          <div className="sweet-loading" style = {{width: '100%', height: '100vh', background: 'white', opacity: 0.5}}>
          <FadeLoader
            css={override}
            size={150}
            color={"#36D7AA"}
            loading={loading}
          />
        </div>
        )}
        
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
      
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/dashboard" className="nav-link" >{t('dashboard.label')}</NavLink>
          </NavItem>

          <NavItem className="px-3">
            <Link to="/wallet" className="nav-link">{t('myWallet.label')}</Link>
          </NavItem>
        </Nav>

        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <span>{user.name}</span>
          </NavItem>

          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              {user.avatar === '' ? (
                <img src={'../../assets/img/avatars/default_avatar.png'} className="img-avatar" alt="user_profile_img" />
              ) : (
                <img src={baseAvatarUrl + user.avatar} className="img-avatar" alt="user_profile_img" />
              )}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center"><strong>{t('settings.label')}</strong></DropdownItem>
              {user && user._id ? (
                <DropdownItem><Link to={'/profile/' + user._id} className="nav-link"><i className="fa fa-user"></i> {t('profile.label')}</Link></DropdownItem>
              ) : (
                <DropdownItem><Link to={'/profile/' + user.userId} className="nav-link"><i className="fa fa-user"></i> {t('profile.label')}</Link></DropdownItem>
              )}
              <DropdownItem><i className="fa fa-wrench"></i>{t('myaccount.label')}</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={this.logout}><i className="fa fa-lock"></i> {t('logout.label')}</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    logoutUser: Actions.logoutUser
  }, dispatch);
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loading: state.user.loading
  }
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(DefaultHeader)));


