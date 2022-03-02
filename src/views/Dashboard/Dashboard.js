import React, { Component } from 'react';
import { withStyles, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core';
import Runtext from './components/Runtext';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import api from '../../ApiConfig';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import * as Actions from '../../state/actions';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';
import { withTranslation } from 'react-i18next';


const styles = theme => ({
  layoutRoot: {},
  media: {
    height: 140,
  },
  formControl: {
    margin: 10,
    minWidth: 200,
    maxWidth: 300,
    background: 'white'
  },
  card: {
    position: 'relative',
    boxShadow: '1px -1px 5px 8px rgba(0,0,0,0.74)',
    width: '150px',
    margin: '10px'
  },

  gameName: {
    fontSize: '10px'
  },
  loadMoreBtn: {
    color: 'white',
    background: 'blueviolet',
  },
  startBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    background: 'lightblue'
  }

});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const game_catetories = [
  'IM-Slots',
  // 'Playtech',
  // 'IMFISHING',
];

const game_vendorNames = [
  'Pragmatic_Play',
  // 'Top_Trend_Gaming',
  'Play_N_Go',
  // 'Blue_Print',
  // 'Netent',
  // 'Jumbo'
];


class Dashboard extends Component {

  state = {
    PlayerId: '',
    MerchantCode: process.env.REACT_APP_MARCHANT_CODE,
    ProductWallet: 101,
    TransactionId: 'Transaction_',
    Amount: 25.00,
    GameCode: 'imgame16001',
    Language: 'EN',
    IpAddress: '188.42.136.32',
    Http: 1,
    IsDownload: 0,
    LobbyURL: "http://operatorurl.com/lobby",
    Route: 1,
    BetLimitId: 1,
    RoomId: '10001',

    game_category: ['IM-Slots'],
    game_vendorName: [],
    no_games: 0,
  }

  componentDidMount() {
    api.post("/player/getPlayerIdByUserId", {user_id: this.props.user._id}).then(res => {
      if(res.data.success) {
        this.setState({PlayerId: res.data.doc.PlayerId})
      } else {
        console.log('can not get playerid')
      }
    })
    this.props.getInitailGames();
    this.getNumberOfGames();
  }

  componentDidUpdate(prevProps, prevState) {

    if (!_.isEqual(this.props, prevProps)) {
      
      api.post("/player/getPlayerIdByUserId", {user_id: this.props.user._id}).then(res => {
        if(res.data.success) {
          this.setState({PlayerId: res.data.doc.PlayerId})
        } else {
          console.log('can not get playerid')
        }
      })

      this.getNumberOfGames();
    }
  }


  getNumberOfGames = () => {
    var number = this.props.games.length;
    this.setState({ no_games: number })
  }

  handleChangeGameCategory = event => {
    this.setState({ game_category: event.target.value })
  }

  handleChangeGameVendorName = event => {
    this.setState({ game_vendorName: event.target.value }, () => {
      this.props.filterGames(this.state.game_vendorName);
    })
  }

  getMoreGame = () => {
    this.props.getMoreGame(this.state.no_games, this.state.game_vendorName);
  }

  playGame = async (game) => {
    var PlayerId = this.state.PlayerId;
    const lunchGameData =
    {
      MerchantCode: this.state.MerchantCode,
      PlayerId: this.state.PlayerId,
      GameCode: game.gameCode.pc,
      Language: this.state.Language,
      IpAddress: this.state.IpAddress,
      ProductWallet: game.ProductWallet,
      Http: this.state.Http,
      IsDownload: 0,
      LobbyURL: this.state.LobbyURL,
      Tray: this.state.Tray,
      Route: this.state.Route,
      BetLimitId: this.state.BetLimitId,
      RoomId: "10001"
    }

    api.post('/player/palyGameBYGameCode', { id: this.props.user._id, PlayerId: PlayerId, lunchGameData: lunchGameData }).then(res => {
      if (res.data.success === true) {
        window.open(res.data.gameURL, "_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");
      } else {
        alert(res.data.message)
      }
    })
  }

  finishGame = () => {
    var current_transaction_id = this.state.TransactionId + this.createUUID();
    const balancePlayer = {
      MerchantCode: this.state.MerchantCode,
      PlayerId: this.state.PlayerId,
      ProductWallet: this.state.ProductWallet
    }
    api.post('/player/finishGame', { id: this.props.user._id, current_transaction_id: current_transaction_id, balancePlayer: balancePlayer }).then(res => {
      alert(res.data.message)
    })
  }

  render() {
    const { classes, games } = this.props
    const { t } = this.props;
    return (
      <div className="p-24">
     
        <div className="flex">
          <Runtext />
        </div>

        <div className="games-container">
          <Typography variant="h6" color="inherit" className={classes.grow}>
            <span className="cursor-pointer">{t('slots.label')}</span>
          </Typography>

          <div className={classNames(classes.filerBar)}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="select-multiple-checkbox" > {t('gameCategory.label')}</InputLabel>
              <Select
                multiple
                value={this.state.game_category}
                onChange={this.handleChangeGameCategory}
                input={<Input id="select-multiple-checkbox" />}
                renderValue={selected => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {game_catetories.map(name => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={this.state.game_category.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="select-multiple-checkbox" >{t('gameVendorName.label')}</InputLabel>
              <Select
                multiple
                value={this.state.game_vendorName}
                onChange={this.handleChangeGameVendorName}
                input={<Input id="select-multiple-checkbox" />}
                renderValue={selected => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {game_vendorNames.map(name => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={this.state.game_vendorName.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="d-flex mt-4 flex-wrap justify-content-center">
            {games !== undefined && games !== [] && (
              games.map((option, index) => (

                <Card className={classes.card} key={index}>
                  <CardActionArea onClick={() => this.playGame(option)}>
                    <CardMedia
                      className={classes.media}
                      image={option.gameIcon}
                      title="game title"
                      style={styles.gameicon}
                    />
                    <CardContent className="p-1">
                      <Typography className={classes.gameName}>
                        name: {option.gameName}
                      </Typography>
                      <Typography className={classes.gameName}>
                        type: {option.gameType}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" className={classNames(classes.startBtn, "bg-grey")} onClick={() => this.playGame(option)}>
                      {t('playBtn.label')}
                    </Button>
                  </CardActions>
                </Card>

              ))
            )}

          </div>

          <div className=" text-center pb-4">
            <Button variant="outlined" className={classes.loadMoreBtn} onClick={this.getMoreGame}>
              {t('loadmoreBtn.label')}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getInitailGames: Actions.getInitailGames,
    saveImslotsGame: Actions.saveImslotsGame,
    getMoreGame: Actions.getMoreGame,
    filterGames: Actions.filterGames,
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    user: state.user,
    games: state.homeslotes.games
  }
}

export default withTranslation()(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))));
