import React, { Component } from 'react';
import { withStyles, Button, FormControl, MenuItem, InputLabel, Select } from '@material-ui/core';
import { FormGroup, Label } from 'reactstrap';
import DatePicker from 'reactstrap-date-picker';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import api from '../../ApiConfig';
import _ from 'lodash';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';



const styles = theme => ({
  root: {},
  formControl: {
    margin: 10,
    width: 200,
  },
  textField: {
    margin: 10,
  }
});


class CreatePlayer extends Component {

  state = {
    MerchantCode: process.env.REACT_APP_MARCHANT_CODE,
    PlayerId: '',
    Currency: '',
    Password: '',
    Country: '',
    Sex: '',
    BirthDate: '',
    selectedDate: new Date().toISOString(),
    converted_selectedDate: '',
  }

  componentDidMount() {
    var user_id = this.props.user._id;
    this.setState({ PlayerId: process.env.REACT_APP_IMONE_PREFIX + user_id })
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(this.props, prevProps)) {
      var user_id = this.props.user._id;
      this.setState({ PlayerId: process.env.REACT_APP_IMONE_PREFIX + user_id })
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };


  handleDateChange = (value, formattedValue) => {
    this.setState({
      selectedDate: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      converted_selectedDate: this.yyyymmdd(formattedValue) // Formatted String, ex: "11/19/2016"
    })
  };

  yyyymmdd = (formattedValue) => {
    var x = new Date(formattedValue);
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    (d.length === 1) && (d = '0' + d);
    (m.length === 1) && (m = '0' + m);
    var yyyymmdd = y + m + d;
    return yyyymmdd;
  }
  

  canBeSubmitted = () => {
    const { Currency, Password, Country, Sex } = this.state;
    return (
      Currency.length > 0 &&
      Password.length > 5 &&
      Password.length < 40 &&
      Country.length > 0 &&
      Sex.length > 0
    );
  }

  handleSubmit = () => {
    const submitData = {
      user_id: this.props.user._id,
      MerchantCode: this.state.MerchantCode,
      PlayerId: this.state.PlayerId,
      Currency: this.state.Currency,
      Password: this.state.Password,
      Country: this.state.Country,
      Sex: this.state.Sex,
      BirthDate: this.state.converted_selectedDate
    }

    api.post('/player/create', submitData).then(res => {
      if(res.data.success === true) {
        this.props.history.push('/dashboard')
      } else {
        alert(res.data.message)
      }
    })

  }

  render() {
    const { classes, t } = this.props;
    return (

      <div className="animated fadeIn">
        <Row>
          <Col xl={6}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> {t('createNewPlayerForm.title')}
              </CardHeader>
              <CardBody>
                <div className="">
                  <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}
                  >

                    <div className="flex-row ">
                      <FormControl className={classes.formControl}>
    <InputLabel htmlFor="currency">{t('currency.label')}</InputLabel>
                        <Select
                          value={this.state.Currency}
                          onChange={this.handleChange('Currency')}
                          inputProps={{
                            name: 'Currency',
                            id: 'currency',
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="CNY">CNY</MenuItem>
                          <MenuItem value="USD">USD</MenuItem>
                          <MenuItem value="EUR">EUR</MenuItem>
                          <MenuItem value="JPY">JPY</MenuItem>
                          <MenuItem value="MYR">MYR</MenuItem>
                          <MenuItem value="IDR">IDR</MenuItem>
                          <MenuItem value="VND">VND</MenuItem>
                          <MenuItem value="THB">THB</MenuItem>
                          <MenuItem value="KRW">KRW</MenuItem>
                          <MenuItem value="CGC">CGC</MenuItem>
                        </Select>
                      </FormControl>

                      <TextValidator
                        label={t('password.label')}
                        name="password"
                        value={this.state.Password}
                        className={classes.textField}
                        margin="normal"
                        onChange={this.handleChange('Password')}
                        validators={['matchRegexp:^[0-9a-zA-Z]{5,40}$']}
                        errorMessages={['password should be at least 5 characters and only number and alphabet charaters']}
                      />
                    </div>
                    <div className="flex-row ">
                      <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="country">{t('country.label')}</InputLabel>
                        <Select
                          value={this.state.Country}
                          onChange={this.handleChange('Country')}
                          inputProps={{
                            name: 'Country',
                            id: 'Country',
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="CN">CN</MenuItem>
                          <MenuItem value="US">US</MenuItem>
                          <MenuItem value="GB">GB</MenuItem>
                          <MenuItem value="JP">JP</MenuItem>
                          <MenuItem value="MY">MY</MenuItem>
                          <MenuItem value="ID">ID</MenuItem>
                          <MenuItem value="VN">VN</MenuItem>
                          <MenuItem value="TH">TH</MenuItem>
                          <MenuItem value="KR">KR</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="sex">{t('sex.label')}</InputLabel>
                        <Select
                          value={this.state.Sex}
                          onChange={this.handleChange('Sex')}
                          inputProps={{
                            name: 'Sex',
                            id: 'sex',
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="M">M</MenuItem>
                          <MenuItem value="F">F</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    <div className="mt-2">
                      <FormGroup style = {{width: '50%'}}>
                        <Label>{t('birthDay.label')}</Label>
                        <DatePicker
                          style = {{display: 'flex', flexWrap: 'inherit'}}
                          id="birthday"
                          value={this.state.selectedDate}
                          onChange={(v, f) => this.handleDateChange(v, f)} />
                      </FormGroup>
                    </div>

                    <div className="mt-20">
                      <Button type="submit" variant="contained" color="secondary" className={classes.button} disabled={!this.canBeSubmitted()}>
                        {t('createPlayerBtn.label')}
                      </Button>
                    </div>

                  </ValidatorForm>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    // setUserData: Actions.setUserData
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default withTranslation()(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(CreatePlayer))));