import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import api from '../../ApiConfig';
import AboutTab from './tabs/AboutTab';
// import BankInfo from './tabs/BankInfo';
import ChangePassword from './tabs/ChangePassword';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../state/actions';
import classNames from 'classnames';
import _ from 'lodash';

import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Row, Col } from 'reactstrap';



const styles = theme => ({
  profileContainer: {
    padding: '3%',
    marginTop: '3%',
    marginBottom: '3%',
    borderRadius: '0.5rem',
    background: '#fff'
  },
  fileContainer: {
    position: 'relative',
    overflow: 'hidden',
    width: '70%',
    border: 'none',
    borderRadius: 0,
    fontSize: '15px',
    background: '#212529b8',
    color: '#fff',
    textAlign: 'center'
  }
});

class Profile extends Component {

  state = {
    file: null,
    accountData: [],

    activeTab: '1'
  };

  componentDidMount() {
    this.getAccountData(this.props.match.params);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(this.props, prevProps)) {
      this.getAccountData(this.props.match.params);
    }
  }

  getAccountData = userId => {
    api.post('/profile/getUserProfileById', userId).then(res => {
      this.setState({ accountData: res.data.doc });
    });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  onChange = e => {
    this.setState({ file: e.target.files[0] });
  }

  onFormSubmit = () => {
    const formData = new FormData();
    formData.append('file', this.state.file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    api.post("/upload", formData, config)
      .then((response) => {
        if (response.data.success === true) {
          var filename = response.data.file.filename
          api.post('/profile/setavatar', { filename: filename, id: this.props.match.params.id }).then((response) => {
            if (response.data.success === true) {
              this.setState({ accountData: response.data.doc });
              this.props.setUserData(response.data.doc)
            }
          })
        }
      }).catch((error) => {
        console.log(error)
      });
  }

  toggle = tab => {
    if(this.state.activeTab !== tab) this.setState({activeTab: tab});
  }

  render() {

    const baseAvatarUrl = process.env.REACT_APP_UPLOAD_URL; 

    var userId = this.state.accountData._id;
    const { classes, user } = this.props

    return (
      <div className={classNames(classes.profileContainer, "container")}>
        <form method="post">
          <div className="row">
            <div className="col-md-4">
              <div className="profile-img text-align-center">
                {user && user.avatar === '' ? (
                  <img src={'../../assets/img/avatars/default_avatar.png'} alt="profile_img" style={{ width: '70%', height: '100%' }} />
                ) : (
                  <img src={baseAvatarUrl + user.avatar} alt="profile_img" style={{ width: '70%', height: '100%' }} />
                )}
                
                <div className={classes.fileContainer}>
                  Change Photo
                  <input type="file" name="file" style={{ position: 'absolute', opacity: 0, right: 0, top: 0 }} onChange={this.onChange}/>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-head">
                <h5>
                  {user.name}
                </h5>
                <h6>
                  {user.email}
                </h6>
                <p className="proile-rating">Phone Number: {user.phone_number}</p>
              </div>
            </div>
            
          </div>
          <div className="row">
            <div className="col-md-4 mt-2">
              <Button onClick={this.onFormSubmit}>upload</Button>
            </div>
            <div className="col-md-8">
              <div>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classNames({ active: this.state.activeTab === '1' })}
                      onClick={() => { this.toggle('1'); }}
                    >
                      Account Information
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classNames({ active: this.state.activeTab === '2' })}
                      onClick={() => { this.toggle('2'); }}
                    >
                      Change Password
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Col sm="12">
                        <AboutTab user_id={userId} />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Col sm="12">
                        <ChangePassword id={userId} />
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setUserData: Actions.setUserData
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}


export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile)));


