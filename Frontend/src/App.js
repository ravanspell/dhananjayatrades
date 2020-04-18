import React, { Component, Fragment } from 'react';
import './App.css';
import Navigation from './components/navBar';
import ViewOrder from './components/viewOrder';
import Dashboard from "./components/dashboard";
import Login from "./components/login";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Router>
          <Switch>

            <main>
              <Route path="/page" component={Navigation} />
              <div className="container-fluid">
                <Route path="/login" exact component={Login} />
                <Route path="/page/dashboard" exact component={Dashboard} />
                <Route path="/page/order" exact component={ViewOrder} />
              </div>
            </main>
          </Switch>
        </Router>
      </Fragment >
    );
  }
}

export default App;

