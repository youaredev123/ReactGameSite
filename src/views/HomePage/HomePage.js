import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import { withStyles, Typography } from '@material-ui/core';
import HomeNav from '../../components/HomeNav';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import classNames from 'classnames';
import HomeSlots from './HomeSlots';
import { withTranslation } from 'react-i18next';
import { Helmet } from "react-helmet";
import api from '../../ApiConfig';

const styles = theme => ({
  bannerDiv: {
    paddingTop: 10,
    paddingBottom: 0,
    paddingRight: 5,
    paddingLeft: 5,
    position: 'relative'
  },
  carouselDiv: {
    height: 400,
    backgroundColor: '#141622',
  },
  sliderConainer: {
    height: '100%'
  },
  appContainer: {
    backgroundImage: "url('assets/images/bod.jpg')"
  },
  slotContainer: {
    maxWidth: 1800,
  },
  contentConainer: {
    textAlign: 'center',
    paddingBottom: 100
  },
  Title: {
    color: '#fff'
  },
  subTitle: {
    textAlign: 'justify',
    color: '#fff'
  }
});

class HomePage extends Component {

  state = {
    meta_info: {},
    height: '100%'
  }

  componentDidMount() {
 
    var width = window.innerWidth;
    if(width < 415) {
      this.setState({height: '200px'})
    }

    window.addEventListener('resize', this.updateWindowDimensions);

    this.getMetaInfo();
    if (this.props.user && this.props.user.email) {
      this.props.history.push('/dashboard')
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    var width = window.innerWidth;
    if(width < 415) {
      this.setState({height: '200px'})
    } else {
      this.setState({height: '100%'})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user !== this.props.user) {
      if (this.props.user && this.props.user.email) {
        this.props.history.push('/dashboard')
      }
    }
  }

  getMetaInfo = () => {
    api.get('/admin/setting/meta-info').then(res => {
      if(res.data.success === true) {
        this.setState({meta_info: res.data.doc})
      } else {
        console.log('getting meta info error');
      }
    })
  }

  render() {
    const { classes, t } = this.props;
    const {meta_info} = this.state;
    return (
      <div>

        <Helmet>
          <html lang="en" />
          <title>{meta_info.title}</title>
          <meta name="description" content={meta_info.description} />
          <meta name="keywords" content={meta_info.keyword} ></meta>
          <link rel="shortcut icon" type="image/png" href={meta_info.logo_url}/>
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-82198918-48"></script>
          <script>
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-82198918-48');
          `}
            
          </script>
        </Helmet>

        <div className={classNames(classes.appContainer, "app")} >
          <HomeNav />
          <div className={classNames(classes.carouselDiv, "home-carousel")}>

            <Carousel
              additionalTransfrom={0}
              arrows
              autoPlay
              autoPlaySpeed={2000}
              centerMode={false}
              className={classes.sliderConainer}
              containerClass=""
              dotListClass=""
              draggable
              focusOnSelect={false}
              infinite
              itemClass=""
              keyBoardControl
              minimumTouchDrag={80}
              renderButtonGroupOutside={false}
              renderDotsOutside={false}
              responsive={{
                desktop: {
                  breakpoint: {
                    max: 3000,
                    min: 1024
                  },
                  items: 1
                },
                mobile: {
                  breakpoint: {
                    max: 464,
                    min: 0
                  },
                  items: 1
                },
                tablet: {
                  breakpoint: {
                    max: 1024,
                    min: 464
                  },
                  items: 1
                }
              }}

              sliderClass=""
              slidesToSlide={1}
              swipeable
            >
              <img
                alt="banner1"
                src="assets/images/banner1.jpg"
                style={{
                  display: 'block',
                  margin: 0,
                  width: '100%'
                }}
                height = {this.state.height}
              />
              <img
                alt="banner2"
                src="assets/images/banner2.jpg"
                style={{
                  display: 'block',
                  margin: 0,
                  width: '100%'
                }}
                height = {this.state.height}
              />
            </Carousel>
          </div>
          <Container className={classes.slotContainer}>
            <div className="game-board">
              <HomeSlots />
            </div>
          </Container>

          <Container className={classes.contentConainer}>
            <Typography variant="h5" component="h2" className={classes.Title} style={{ marginTop: 40 }}>
              {t('home.title1')}
            </Typography>

            <Typography variant="body1" component="h2" className={classes.subTitle} style={{ marginTop: 20 }}>
              {t('home.content1')}
            </Typography>

            <Typography variant="body1" component="h2" className={classes.subTitle} style={{ marginTop: 10 }}>
              {t('home.content2')}
            </Typography>

            <Typography variant="h5" component="h2" className={classes.Title} style={{ marginTop: 20 }}>
              {t('home.title2')}
            </Typography>

            <Typography variant="body1" component="h2" className={classes.subTitle} style={{ marginTop: 10 }}>
              {t('home.content3')}

            </Typography>

            <Typography variant="body1" component="h2" className={classes.subTitle} style={{ marginTop: 10 }}>
              {t('home.content4')}

            </Typography>

            <Typography variant="h5" component="h2" className={classes.Title} style={{ marginTop: 20 }}>
              {t('home.title3')}

            </Typography>

            <Typography variant="body1" component="h2" className={classes.subTitle} style={{ marginTop: 10 }}>
              {t('home.content5')}

            </Typography>

            <Typography variant="h5" component="h2" className={classes.Title} style={{ marginTop: 20 }}>
              {t('home.title4')}

            </Typography>

            <Typography variant="body1" component="h2" className={classes.subTitle} style={{ marginTop: 10 }}>
              {t('home.content6')}
            </Typography>

          </Container>
          
        </div>
      </div>

    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    // submitLogin: Actions.submitLogin
  }, dispatch);
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default withTranslation()(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage))));

