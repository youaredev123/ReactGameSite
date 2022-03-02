import React, { Component } from 'react';
import { Route, Redirect, BrowserRouter, Router } from 'react-router-dom';
import history from './history';
import Config from "./components/Config";
import './i18n'
// import { renderRoutes } from 'react-router-config';
import './App.scss';
const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
//Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));
// Pages
const Login = React.lazy(() => import('./views/Login/Login'));
const Register = React.lazy(() => import('./views/Register/Register'));
const HomePage = React.lazy(() => import('./views/HomePage/HomePage'));
const ForgotPassword = React.lazy(() => import('./views/Forgot-password/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./views/reset-password/ResetPassword'));


class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Config>
          <React.Suspense fallback={loading()}>
            <Router history={history}>
              <Route exact path="/" render={() => (<Redirect to="/home" />)} />
              <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} />
              <Route exact path="/home" name="Home Page" render={props => <HomePage {...props} />} />
              <Route exact path="/forgot-password" name="Forgot Password Page" render={props => <ForgotPassword {...props} />} />
              <Route exact path="/reset-password/:token" name="Reset Password Page" render={props => <ResetPassword {...props} />} />

              <Route exact path="/create-player" name="Create Player Page" render={props => <DefaultLayout {...props} />} />
              <Route exact path="/wallet" name="Wallet Page" render={props => <DefaultLayout {...props} />} />

              <Route exact path="/profile/:id" name="Profile Page" render={props => <DefaultLayout {...props} />} />
              <Route path="/dashboard" name="Dashbard" render={props => <DefaultLayout {...props} />} />

            </Router>
          </React.Suspense>
        </Config>
      </BrowserRouter>
    );
  }
}

export default App;
