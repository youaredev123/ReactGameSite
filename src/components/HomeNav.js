import React, { Component } from 'react';
import { withStyles, Button } from '@material-ui/core';
import classNames from 'classnames';
import history from '../history';
import { withTranslation } from 'react-i18next';
import i18n from 'i18next'

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav
} from 'reactstrap';

import metaService from '../services/metaService';

import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import NativeSelect from '@material-ui/core/NativeSelect';

const styles = theme => ({
  root: {
  },
  grow: {
    flexGrow: 2,
  },
  grow2: {
    flexGrow: 1,
    fontFamily: 'cursive',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  comeInButton: {
    borderColor: 'white',
    background: '#b90c0ced'
  },
  languageForm: {
    background: 'white'
  },
  navForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline'
  }
});

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

class HomeNav extends Component {

  state = {
    isOpen: false,
    language: '',
    logo_url: '',
    device_width: ''
  }

  componentDidMount() {

    var width = window.innerWidth;
    this.setState({ device_width: width })

    let currentLanguage = this.getLanguage();
    if (currentLanguage === 'en') {
      this.setState({ language: 'English' })
    } else if (currentLanguage === 'in') {
      this.setState({ language: 'Indonesian' })
    }

    metaService.getMetaInfo().then(res => {
      this.setState({ logo_url: res.logo_url })
    })
      .catch(message => {
        console.log(message)
      })

    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ device_width: window.innerWidth });
  }


  getLanguage = () => {
    return i18n.language || window.localStorage.i18nextLng
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  goToLogin = () => {
    history.push('/login')
  }

  goToRegister = () => {
    history.push('/register')
  }

  handleChange = (event) => {
    const { i18n } = this.props;
    if (event.target.value === 'en') {
      this.setState({ language: "English" })
    } else if (event.target.value === 'in') {
      this.setState({ language: 'Indonesian' })
    }
    i18n.changeLanguage(event.target.value)
  }

  render() {
    const { classes, t } = this.props;
    const { isOpen, logo_url, device_width } = this.state;

    return (
      <div className={classes.root}>
        <Navbar expand="md" style={{ background: "#212633", color: '#fff', position: 'static' }}>
          <NavbarBrand to="/home">
            {logo_url !== '' && (
              <img src={logo_url} className="img-avatar" alt="logo" width="100px" />
            )}
          </NavbarBrand>

          <NavbarToggler onClick={this.toggle} style={{ background: '#d1c6c6', color: 'black' }} ><label>MENU</label></NavbarToggler>

          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              {/* <NavItem>
                <NavLink to="/">{t('slots.label')}</NavLink>
              </NavItem> */}
            </Nav>
            {/* <NavbarText style={{ paddingRight: 20 }}>
              {t('PROMOTIONS.label')}
            </NavbarText> */}

            {device_width > 765 ? (
              <Nav>
                <FormControl className={classes.languageForm}>
                  <NativeSelect
                    id="select-language"
                    value={this.state.language}
                    onChange={(e) => this.handleChange(e)}
                    input={<BootstrapInput />}
                  >

                    <option value="">
                      {this.state.language}
                    </option>
                    {this.state.language === 'Indonesian' && (
                      <option value="en">
                        English
                      </option>
                    )}

                    {this.state.language === 'English' && (
                      <option value="in">
                        Indonesian
                      </option>
                    )}

                  </NativeSelect>
                </FormControl>
                <Button variant="outlined" className={classNames(classes.comeInButton, "text-white mx-4")} onClick={this.goToLogin}>
                  {t('to-come-in.label')}
                </Button>

                <Button variant="contained" className="font-sans text-white mx-4" style={{ background: '#3598fe' }} onClick={this.goToRegister}>
                  {t('registration.label')}
                </Button>
              </Nav>
            ) : (
                <Nav className={classNames(classes.navForm, "nav-form")}>
                  <FormControl className={classes.languageForm}>

                    <NativeSelect
                      id="select-language"
                      value={this.state.language}
                      onChange={(e) => this.handleChange(e)}
                      input={<BootstrapInput />}
                    >
                      <option>
                        {this.state.language}
                      </option>
                      <option value="en">
                        English
                  </option>
                      <option value="in">
                        Indonesian
                  </option>
                    </NativeSelect>
                  </FormControl>

                  <Button variant="outlined" className={classNames(classes.comeInButton, "text-white mt-2")} onClick={this.goToLogin}>
                    {t('to-come-in.label')}
                  </Button>

                  <Button variant="contained" className="font-sans text-white mt-2" style={{ background: '#3598fe' }} onClick={this.goToRegister}>
                    {t('registration.label')}
                  </Button>
                </Nav>
              )}


          </Collapse>
        </Navbar>
      </div>
    );
  }
}


export default withTranslation()(withStyles(styles, { withTheme: true })(HomeNav));
