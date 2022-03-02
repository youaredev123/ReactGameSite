import React, { Component } from 'react';
import { withStyles, Typography, Button } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import classNames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import _ from 'lodash';
import * as Actions from '../../state/actions';
import { withTranslation } from 'react-i18next';
import i18n from "i18next";



const styles = theme => ({
  grow: {
    paddingTop: 50,
    color: 'white'
  },
  filerBar: {

  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
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

  media: {
    height: 140,
  },
  selectPanel: {
    display: 'flex'
  },
  gameName: {
    fontSize: '10px'
  },
  loadMoreBtn: {
    color: 'white',
    background: 'blueviolet',
  },
  playBtn: {
    background: 'lightblue'
  },
  gamecontent: {
    height: 60
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



class HomeSlots extends Component {

  state = {
    game_category: ['IM-Slots'],
    game_vendorName: [],
    no_games: 0,
    open: false,
  };

  componentDidMount() {
    this.props.getInitailGames();
    // this.props.saveImslotsGame();
    this.getNumberOfGames();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(this.props, prevProps)) {
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

  goToLogin = () => {
    this.props.history.push('/login');
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, games, t } = this.props;
    let current_lang = i18n.language

    return (
      <div className="games-container">
        <Typography variant="h6" color="inherit" className={classes.grow}>
          <span className="cursor-pointer">{t('slots.label')}</span>
        </Typography>

        <div className={classNames(classes.filerBar)}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="select-multiple-checkbox" >{t('gameCategory.label')}</InputLabel>
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

        <div className="d-flex mt-40 flex-wrap justify-content-center">
          {games !== undefined && games !== [] && (
            games.map((option, index) => (

              <Card className={classes.card} key={index}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={option.gameIcon}
                    title="game title"
                    style={styles.gameicon}
                  />
                  <CardContent className={classes.gamecontent}>
                    <Typography className={classes.gameName}>
                      name: {option.gameName}
                    </Typography>
                    <Typography className={classes.gameName}>
                      type: {option.gameType}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions className="d-flex justify-content-center" style={{}}>
                  <Button size="small" color="primary" onClick={this.handleClickOpen} className={classes.playBtn}>
                    Play
                  </Button>
                </CardActions>
              </Card>

            ))
          )}

        </div>

        <div className="loadmore_btn text-center mt-40 pb-80">
          <Button variant="outlined" className={classes.loadMoreBtn} onClick={this.getMoreGame}>
            Load More
          </Button>
        </div>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {current_lang === 'in' && (
            <DialogTitle id="alert-dialog-title">{"Anda yakin memainkan game ini?"}</DialogTitle>

          )}
          {current_lang === 'en' && (
            <DialogTitle id="alert-dialog-title">{"Are you sure to play this game?"}</DialogTitle>

          )}
          <DialogContent>
            {current_lang === 'in' && (
              <DialogContentText id="alert-dialog-description">
                Anda harus masuk ke Play game. Silakan periksa lagi game mana yang Anda ingin pucat melalui game pencarian memilih Nama Vendor Game.
              </DialogContentText>
            )}
            {current_lang === 'en' && (
              <DialogContentText id="alert-dialog-description">
                You need to login to Play games. Please check again which game you want to paly via search games selecting the Game Vendor Names.
              </DialogContentText>
            )}

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              No
            </Button>
            <Button onClick={this.goToLogin} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
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
    games: state.homeslotes.games
  }
}


export default withTranslation()(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeSlots))));

